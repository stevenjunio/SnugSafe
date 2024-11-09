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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder, File, MoreVertical, Upload, Plus } from "lucide-react";
import uploadFile from "@/lib/uploadFile";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified?: string;
};

export function FilePageComponent() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const [newFolderName, setNewFolderName] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        type: "file",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date(file.lastModified).toISOString().split("T")[0],
      };
      setFiles([...files, newFile]);
      uploadFile(file);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        type: "folder",
      };
      setFiles([...files, newFolder]);
      setNewFolderName("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 justify-between items-center sm:flex-row sm:gap-2">
        <h1 className="text-3xl font-bold ">Your Files</h1>
        <div className="flex space-x-2">
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
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </Button>
          </label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      {files.length === 0 && <div>No files found</div>}
      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {files.length > 0 && (
            <div>
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Size</div>
                <div className="col-span-2">Last Modified</div>
                <div className="col-span-1"></div>
              </div>
              {files.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="col-span-6 flex items-center space-x-2">
                    {item.type === "folder" ? (
                      <Folder className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <File className="h-6 w-6 text-blue-500" />
                    )}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.size || "-"}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.lastModified || "-"}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Move</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
