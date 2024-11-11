import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import uploadFile from "@/lib/uploadFile";
import { useCorbado } from "@corbado/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "./FileUpload";
import { FileList } from "./FileList";
import { useUserFiles } from "@/hooks/useUserFiles";
import { FileItem } from "@/types/file.types";

const CreateFolderDialog = ({
  newFolderName,
  setNewFolderName,
  handleCreateFolder,
}: {
  newFolderName: string;
  setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
  handleCreateFolder: () => void;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        New Folder
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button onClick={handleCreateFolder}>Create</Button>
      </div>
    </DialogContent>
  </Dialog>
);

export function FilePageComponent() {
  const { user } = useCorbado();
  const { data, isLoading, isError, error } = useUserFiles();
  const queryClient = useQueryClient();
  const [newFolderName, setNewFolderName] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFileMutation.mutateAsync(file);
    }
  };
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadFile(file, "/", user.sub);
    },
    onSuccess: (newFile) => {
      queryClient.setQueryData(["userFiles"], (fileData) => {
        console.log(`were here`, newFile);
        return [...(fileData as FileItem[]), newFile as FileItem];
      });
    },
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        type: "folder",
      };
      setNewFolderName("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 justify-between items-center sm:flex-row sm:gap-2">
        <h1 className="text-3xl font-bold">Your Files</h1>
        <div className="flex space-x-2">
          <CreateFolderDialog
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            handleCreateFolder={handleCreateFolder}
          />
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && !isError && data && data.length === 0 && (
        <div>No files found</div>
      )}
      {uploadFileMutation.isPending && <div>Uploading...</div>}

      {data && data.length > 0 && <FileList files={data} />}
    </div>
  );
}
