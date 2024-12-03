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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsShareDialogOpen(visible);
    if (visible) {
      console.log(`Opening share dialog for file: ${file?.name}`);
    }
  }, [visible, file]);

  const handleAddShare = async () => {
    if (file && newShareEmail) {
      console.log(
        `Adding share for file: ${file.name} with email: ${newShareEmail} and access: ${newShareAccess}`
      );
      try {
        const response = await fetch(
          import.meta.env.VITE_SERVER_URL + `/api/v1/file/share`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileId: file.id,
              username: newShareEmail,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`the error data we received is, `, errorData.error.error);
          setError(errorData.error.error || "Failed to share the file");
          return;
        }

        setNewShareEmail("");
        setNewShareAccess("view");
        setError(null);
        onClose();
      } catch (err) {
        console.error("Error sharing file:", err);
        setError("Failed to share the file");
      }
    }
  };

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="overflow-hidden mr-10">
          <DialogTitle className="truncate overflow-hidden text-wrap">
            Manage Sharing for {file?.name}
          </DialogTitle>
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
          {error && <p className="text-red-500">{error}</p>}
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
