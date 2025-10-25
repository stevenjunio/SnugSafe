import React from "react";

import uploadFile from "@/lib/uploadFile";
import { useCorbado } from "@corbado/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "./FileUpload";
import { FileList } from "./FileList";
import { useUserFiles } from "@/hooks/useUserFiles";
import { FileItem } from "@/types/file.types";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { BunnyRunner } from "./ui/BunnyRunner";

export function FilePageComponent() {
  const { user } = useCorbado();
  const { data, isLoading, isError, error } = useUserFiles();
  const queryClient = useQueryClient();

  console.log(`we refreshed the data coming from the query`, data);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFileMutation.mutateAsync(file);
    }
    console.log(`the current target is`, event.target);
    event.target.value = "";
  };
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadFile(file, "/", user?.sub || "");
    },
    onSuccess: (newFile) => {
      queryClient.setQueryData(["currentFileSystem"], (fileData) => {
        console.log(`were here`, newFile);
        return [...(fileData as FileItem[]), newFile as FileSystem];
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 justify-between items-center sm:flex-row sm:gap-2">
        <h1 className="text-3xl font-bold">Your Files</h1>
        <div className="flex space-x-2">
          <CreateFolderDialog />
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && !isError && data && data.length === 0 && (
        <div>No files found</div>
      )}
      {uploadFileMutation.isPending && (
        <BunnyRunner fileName={uploadFileMutation.variables.name} />
      )}
      {data && data.length > 0 && <FileList />}
    </div>
  );
}
