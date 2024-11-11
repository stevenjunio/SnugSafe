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
import { useState } from "react";
import { useCorbado } from "@corbado/react";

export const CreateFolderDialog = () => {
  const { user } = useCorbado();
  const handleCreateFolder = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/folder/create`, {
      method: "POST",
      body: JSON.stringify({
        name: "newFolderName",
        user: user.sub,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const [newFolderName, setNewFolderName] = useState("");
  return (
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
};
