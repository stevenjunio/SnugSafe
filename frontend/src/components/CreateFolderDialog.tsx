import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCorbado } from "@corbado/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileItem } from "@/types/file.types";
import { FileSystem } from "@/types/file.types";

export const CreateFolderDialog = () => {
  const queryClient = useQueryClient();
  const newFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/folder/create`,
        {
          method: "POST",
          body: JSON.stringify({
            name: folderName,
            user: user?.sub,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = (await response.json()) as FileSystem;
      return data;
    },
    onSuccess: (newFolder) => {
      queryClient.setQueryData(["currentFileSystem"], (fileData) => {
        return [
          ...(fileData as FileItem[]),
          { ...newFolder, itemType: "folder" } as FileSystem,
        ];
      });
    },
  });
  const { user } = useCorbado();
  const handleCreateFolder = async (folderName: string) => {
    newFolderMutation.mutate(folderName);
    setIsOpen(false);
  };
  const [newFolderName, setNewFolderName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Folder
        </Button> */}
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
          <Button onClick={() => handleCreateFolder(newFolderName)}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
