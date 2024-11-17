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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, File, MoreVertical, Share2, Plus, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SharedItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  sharedWith: { email: string; access: "view" | "edit" }[];
  dateShared: string;
};

export function FileSharingPageComponent() {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([
    {
      id: "1",
      name: "Project Proposal",
      type: "file",
      sharedWith: [
        { email: "john@example.com", access: "edit" },
        { email: "sarah@example.com", access: "view" },
      ],
      dateShared: "2023-05-15",
    },
    {
      id: "2",
      name: "Marketing Assets",
      type: "folder",
      sharedWith: [{ email: "marketing@example.com", access: "edit" }],
      dateShared: "2023-05-10",
    },
  ]);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [newShareEmail, setNewShareEmail] = useState("");
  const [newShareAccess, setNewShareAccess] = useState<"view" | "edit">("view");

  const handleShare = (item: SharedItem) => {
    setSelectedItem(item);
    setIsShareDialogOpen(true);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">File Sharing</h1>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Share New Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Shared With</TableHead>
            <TableHead>Date Shared</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sharedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {item.type === "folder" ? (
                    <Folder className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <File className="h-5 w-5 text-blue-500" />
                  )}
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{item.sharedWith.length}</span>
                </div>
              </TableCell>
              <TableCell>{item.dateShared}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(item)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Manage Sharing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Sharing for {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="email"
                placeholder="Email address"
                className="col-span-3"
                value={newShareEmail}
                onChange={(e) => setNewShareEmail(e.target.value)}
              />
              <Select
                value={newShareAccess}
                onValueChange={(value: "view" | "edit") =>
                  setNewShareAccess(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
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
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
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
