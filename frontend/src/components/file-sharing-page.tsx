import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  File,
  MoreVertical,
  Users,
  ArrowRight,
  ArrowLeft,
  XCircle, // Add this import for the new icon
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCorbado } from "@corbado/react";
import { handleOpenFile } from "@/lib/fileHandlers";
import { SharedItem } from "@/types/file.types";
import ManageSharingDialog from "./ui/ManageSharingDialog";

export function FileSharingPageComponent() {
  const [error, setError] = useState<string | null>(null);
  const [sharedItemManaged, setSharedItemManaged] = useState<SharedItem | null>(
    null
  );
  const queryClient = useQueryClient();
  console.log(`sharedItemManaged: `, sharedItemManaged);

  const user = useCorbado().user?.sub;
  const { sessionToken } = useCorbado();

  const handleClickFile = async (item: SharedItem) => {
    if (item.userFile.type === "file" && sessionToken) {
      const fileURL = await handleOpenFile(item, sessionToken, setError);
      if (fileURL) {
        console.log(`the new file URL is: `, fileURL);

        window.open(fileURL, "_blank");
      }
    } else {
      throw new Error("Invalid file type");
    }
  };

  const { data: sharedToMe } = useQuery({
    queryKey: ["sharedToMe"],
    refetchInterval: 5000,
    queryFn: async () => {
      console.log(`Fetching files shared to me`);
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + `/api/v1/file/share?userID=${user}`,
        {
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      const data = (await response.json()) as SharedItem[];
      console.log(`Files shared to me: `, data);
      return data;
    },
  });

  const combinedSharedItems = [
    ...(sharedToMe?.map((item) => ({
      ...item,
      sharedType: item.sharedTo.authId === user ? "toMe" : "byMe",
    })) || []),
  ];

  return (
    <div className="space-y-6">
      <ManageSharingDialog
        open={sharedItemManaged !== null}
        sharedItem={sharedItemManaged}
        onClose={() => {
          setSharedItemManaged(null);
        }}
      />
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">File Sharing</h1>
        {/* <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Share New Item
        </Button> */}
      </div>

      {combinedSharedItems.length === 0 ? (
        <h3>No files shared</h3>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-6 sm:col-span-6">Name</div>
            <div className="hidden sm:block sm:col-span-3">
              Shared With / By
            </div>
            <div className="col-span-6 sm:col-span-3"></div>
          </div>{" "}
          {combinedSharedItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="col-span-6 sm:col-span-6 flex items-center space-x-2">
                {item.userFile.type === "folder" ? (
                  <Folder className="min-w-6 text-yellow-500" />
                ) : (
                  <File className=" min-w-6 text-blue-500" />
                )}
                <span
                  className="font-medium truncate cursor-pointer hover:underline"
                  onClick={() => {
                    handleClickFile(item);
                  }}
                >
                  {item.userFile.name}
                </span>
                {item.sharedType === "toMe" ? (
                  <ArrowRight className="min-w-6 text-green-500" />
                ) : (
                  <ArrowLeft className="min-w-6 text-red-500" />
                )}
              </div>
              <div className="hidden sm:block sm:col-span-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>
                    {item.sharedType === "toMe"
                      ? item.userFile.user.userName
                      : "Shared to: " + item.sharedTo.userName}
                  </span>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        console.log(`unsharing item clicked`);
                        const response = await fetch(
                          `${import.meta.env.VITE_SERVER_URL}/api/v1/file/share/${item.id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        const deletedItem = await response.json();
                        console.log(`deletedItem: `, deletedItem);
                        queryClient.invalidateQueries({
                          queryKey: ["sharedToMe"],
                        });
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Unshare Item
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
