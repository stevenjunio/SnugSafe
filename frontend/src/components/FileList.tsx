import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  File,
  Folder,
  MoreVertical,
  Share2,
  Edit3,
  Move,
  Trash2,
  Image,
  Video,
  Music,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import getFileURL from "@/lib/openS3File";
import { FileSystem } from "@/types/file.types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import FileSharingDialog from "./FileSharingDialog";
import { useCorbado } from "@corbado/react";

type FileItem = {
  id: string;
  name: string;
  size?: number;
  lastModified?: string;
};

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

export const FileList = () => {
  const queryClient = useQueryClient();
  const { user } = useCorbado();
  const [fileSharing, setFileSharing] = useState<FileSystem | undefined>(
    undefined
  );

  const handleShare = (file: FileSystem) => {
    setFileSharing(file);
  };

  const handleCloseShareDialog = () => {
    setFileSharing(undefined);
  };

  const { data } = useQuery({
    queryKey: ["currentFileSystem"],
    queryFn: async () => {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL +
          `/api/v1/filesystem?user=${encodeURIComponent(`${user?.sub}`)}`
      );
      const data = (await response.json()) as FileSystem[];

      console.log(`filesystem gathered`, data);
      return data.sort((a, b) => a.name.localeCompare(b.name));
    },
  });
  const handleOpenFile = async (file: FileItem) => {
    console.log(`openining file`, file);
    const fileURL = await getFileURL(file.id);

    // open file in new tab
    window.open(fileURL, "_blank");
  };
  const handleDeleteFile = async (item: FileSystem) => {
    if (item.itemType === "file") {
      fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/file/${encodeURIComponent(item.id)}`,
        {
          method: "DELETE",
        }
      ).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["currentFileSystem"],
        });
      });
    }
    if (item.itemType === "folder") {
      fetch(`${import.meta.env.VITE_SERVER_URL}/API/V1/folder/${item.id}`, {
        headers: {},
        method: "DELETE",
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["currentFileSystem"],
        });
      });
    }
    setitemToDelete(undefined);
  };

  const [itemToDelete, setitemToDelete] = useState<FileSystem>();

  // const handleRemoveShare = (email: string) => {
  //   // Implement the logic to remove a share
  // };

  // const handleUpdateAccess = (email: string, newAccess: "view" | "edit") => {
  //   // Implement the logic to update access
  // };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <FileSharingDialog
        visible={fileSharing?.id !== undefined}
        file={fileSharing}
        onClose={handleCloseShareDialog}
      />
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
              onClick={() => setitemToDelete(undefined)}
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
      {data?.map((item) => (
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
                if (item.type === "file") {
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
                {/* <DropdownMenuItem>
                  <Edit3 className="mr-2 h-4 w-4 text-pink-500" />
                  Rename
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem>
                  <Move className="mr-2 h-4 w-4 text-green-500" />
                  Move
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => handleShare(item)}>
                  <Share2 className="mr-2 h-4 w-4 text-purple-500" />
                  Sharing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setitemToDelete(item);
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
