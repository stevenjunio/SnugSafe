import { useQueryClient } from "@tanstack/react-query";
import { File, Folder, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import getFileURL from "@/lib/openS3File";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
};

export const FileList = ({ files }: { files: FileItem[] }) => {
  const queryClient = useQueryClient();
  const handleOpenFile = async (file: FileItem) => {
    console.log(`openining file`, file);
    const fileURL = await getFileURL(file.id);

    // open file in new tab
    window.open(fileURL, "_blank");
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
            {item.type === "folder" ? (
              <Folder className="min-w-6 text-yellow-500" />
            ) : (
              <File className=" min-w-6 text-blue-500" />
            )}

            <span
              className="font-medium truncate"
              onClick={(e) => {
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
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Move</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    console.log(`got deleted`);
                    fetch(
                      `${import.meta.env.VITE_SERVER_URL}/api/v1/file/${encodeURIComponent(item.id)}`,
                      {
                        method: "DELETE",
                      }
                    ).then(() => {
                      queryClient.invalidateQueries({
                        queryKey: ["userFiles"],
                      });
                    });
                  }}
                >
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
