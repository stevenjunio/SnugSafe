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
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const DeleteFolderConfirmationDialog = () => {
  const { user } = useCorbado();

  const [newFolderName, setNewFolderName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="text-red-600 cursor-pointer">
          Delete
        </DropdownMenuItem>
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
          <Button onClick={() => console.log(`dlete`)}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
