import { Button } from "./ui/button";
import { DialogHeader, Dialog, DialogTitle, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { FileSystem } from "@/types/file.types";

export default function FileSharingDialog({
  visible,
  file,
  onClose,
}: {
  visible: boolean;
  file?: FileSystem | undefined;
  onClose: () => void;
}) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(visible);

  const [newShareEmail, setNewShareEmail] = useState("");
  const [newShareAccess, setNewShareAccess] = useState<"view" | "edit">("view");

  useEffect(() => {
    setIsShareDialogOpen(visible);
    if (visible) {
      console.log(`Opening share dialog for file: ${file?.name}`);
    }
  }, [visible, file]);

  const handleAddShare = () => {
    if (file && newShareEmail) {
      console.log(
        `Adding share for file: ${file.name} with email: ${newShareEmail} and access: ${newShareAccess}`
      );
      // Implement the logic to add a new share
      setNewShareEmail("");
      setNewShareAccess("view");
      onClose();
    }
  };

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Sharing for {file?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Input
              id="username"
              placeholder="Username"
              className="col-span-3"
              value={newShareEmail}
              onChange={(e) => setNewShareEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleAddShare}>Add Share</Button>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Current Shares:</h4>
            {/* TO DO: implement file sharing mechanism */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
