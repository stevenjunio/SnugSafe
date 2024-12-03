import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Share2,
  Plus,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useCorbado } from "@corbado/react";
import { FileShare } from "@/types/file.types";
import { handleOpenFile } from "@/lib/fileHandlers";

type SharedItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  sharedWith: { email: string; access: "view" | "edit" }[];
  dateShared: string;
};

export function FileSharingPageComponent() {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [newShareEmail, setNewShareEmail] = useState("");
  const [newShareAccess, setNewShareAccess] = useState<"view" | "edit">("view");
  const [error, setError] = useState<string | null>(null);
  const user = useCorbado().user?.sub;
  const { sessionToken } = useCorbado();

  const { data: sharedToMe } = useQuery({
    queryKey: ["sharedToMe"],
    queryFn: async () => {
      console.log(`Fetching files shared to me`);
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + `/api/v1/file/share?userID=${user}`,
        {
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      const data = (await response.json()) as FileShare[];
      console.log(`Files shared to me: `, data);
      return data;
    },
  });

  const combinedSharedItems = [
    ...(sharedToMe?.map((item) => ({ ...item, sharedType: "toMe" })) || []),
  ];

  const handleShare = () => {
    // IMPLEMENT SHARING MANAGEMENT LOGIC HERE
    setSelectedItem(null);
  };

  const handleAddShare = () => {
    if (selectedItem && newShareEmail) {
      const updatedItems = sharedItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              sharedWith: [
                ...item.sharedWith,
                { email: newShareEmail, access: newShareAccess },
              ],
            }
          : item
      );
      setSharedItems(updatedItems);
      setNewShareEmail("");
      setNewShareAccess("view");
      setIsShareDialogOpen(false);
    }
  };

  const handleRemoveShare = (itemId: string, email: string) => {
    const updatedItems = sharedItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            sharedWith: item.sharedWith.filter(
              (share) => share.email !== email
            ),
          }
        : item
    );
    setSharedItems(updatedItems);
  };

  const handleUpdateAccess = (
    itemId: string,
    email: string,
    newAccess: "view" | "edit"
  ) => {
    const updatedItems = sharedItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            sharedWith: item.sharedWith.map((share) =>
              share.email === email ? { ...share, access: newAccess } : share
            ),
          }
        : item
    );
    setSharedItems(updatedItems);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">File Sharing</h1>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Share New Item
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-6 sm:col-span-6">Name</div>
          <div className="hidden sm:block sm:col-span-3">Shared With / By</div>
          <div className="hidden sm:block sm:col-span-2">Type</div>
          <div className="col-span-6 sm:col-span-1"></div>
        </div>
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
                  if (item.userFile.type === "file" && sessionToken) {
                    handleOpenFile(item, sessionToken, setError);
                  } else {
                    throw new Error("Invalid file type");
                  }
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
                    : "Shared by me"}
                </span>
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2 text-sm text-gray-500 dark:text-gray-400">
              {item.userFile.type}
            </div>
            <div className="col-span-6 sm:col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare()}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Manage Sharing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Sharing for {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="">
              <Input
                id="email"
                placeholder="Username"
                className="col-span-3"
                value={newShareEmail}
                onChange={(e) => setNewShareEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleAddShare}>Add Share</Button>
            <div className="mt-4">
              <h4 className="mb-2 font-semibold">Current Shares:</h4>
              {selectedItem?.sharedWith.map((share) => (
                <div
                  key={share.email}
                  className="flex items-center justify-between py-2"
                >
                  <span>{share.email}</span>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={share.access}
                      onValueChange={(value: "view" | "edit") =>
                        handleUpdateAccess(selectedItem.id, share.email, value)
                      }
                    ></Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemoveShare(selectedItem.id, share.email)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
