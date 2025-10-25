import { useState } from "react";
import {
  File,
  Folder,
  MoreVertical,
  Trash2,
  Image,
  Video,
  Music,
  FileText,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { FileSystem } from "@/types/file.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "pdf":
      return <FileText className="min-w-6 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image className="min-w-6 text-green-500" />;
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="min-w-6 text-purple-500" />;
    case "mp3":
    case "wav":
      return <Music className="min-w-6 text-yellow-500" />;
    case "txt":
    case "doc":
    case "docx":
      return <FileText className="min-w-6 text-blue-500" />;
    default:
      return <File className="min-w-6 text-gray-500" />;
  }
};

export const DemoFileList = ({
  files,
  setFiles,
}: {
  files: FileSystem[];
  setFiles: React.Dispatch<React.SetStateAction<FileSystem[]>>;
}) => {
  const [itemToDelete, setItemToDelete] = useState<FileSystem>();

  const handleOpenFile = (file: FileSystem) => {
    // Retrieve file from sessionStorage
    const storedFile = sessionStorage.getItem(`demo-file-${file.id}`);
    if (storedFile) {
      const fileData = JSON.parse(storedFile);

      // Detect if the user is on mobile Safari
      const isMobileSafari = /iP(ad|hone|od).+Version\/[\d.]+.*Safari/i.test(
        navigator.userAgent
      );

      if (isMobileSafari) {
        // Use window.location.href to open the file URL on mobile Safari
        window.location.href = fileData.content;
      } else {
        // Open file in new tab
        window.open(fileData.content, "_blank");
      }
    }
  };

  const handleDeleteFile = (item: FileSystem) => {
    // Remove from files list
    setFiles((prev) => prev.filter((f) => f.id !== item.id));

    // Remove from sessionStorage
    sessionStorage.removeItem(`demo-file-${item.id}`);

    setItemToDelete(undefined);
  };

  const handleDownloadFile = (file: FileSystem) => {
    const storedFile = sessionStorage.getItem(`demo-file-${file.id}`);
    if (storedFile) {
      const fileData = JSON.parse(storedFile);

      // Create download link
      const link = document.createElement('a');
      link.href = fileData.content;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <Dialog open={!!itemToDelete}>
        <DialogContent>
          {itemToDelete && (
            <DialogHeader>
              <DialogTitle>
                {`Are you sure you want to delete this ${itemToDelete?.itemType[0]?.toUpperCase().concat(itemToDelete.itemType.slice(1))}`}
              </DialogTitle>
              <DialogDescription>
                {`Are you sure you want to delete the ${itemToDelete?.itemType[0]
                  ?.toUpperCase()
                  .concat(
                    itemToDelete.itemType.slice(1)
                  )} ${itemToDelete?.name}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant={"secondary"}
              onClick={() => setItemToDelete(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() =>
                itemToDelete ? handleDeleteFile(itemToDelete) : null
              }
            >
              Delete{" "}
              {itemToDelete?.itemType[0]
                .toUpperCase()
                .concat(itemToDelete.itemType.slice(1))}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        <div className="col-span-6">Name</div>
        <div className="col-span-3">Size</div>
        <div className="col-span-1"></div>
      </div>
      {files.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="col-span-6 flex items-center space-x-2">
            {item.itemType === "folder" ? (
              <Folder className="min-w-6 text-yellow-500" />
            ) : (
              getFileIcon(item.name)
            )}
            <span
              className="font-medium truncate cursor-pointer hover:underline"
              onClick={() => {
                if (item.itemType === "file") {
                  handleOpenFile(item);
                }
              }}
            >
              {item.name}
            </span>
          </div>
          <div className="col-span-5 text-sm text-gray-500 dark:text-gray-400">
            {item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : "-"}
          </div>

          <div className="col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownloadFile(item)}>
                  <Download className="mr-2 h-4 w-4 text-blue-500" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setItemToDelete(item);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
