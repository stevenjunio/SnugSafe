import { SharedItem } from "@/types/file.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ManageSharingDialogProps {
  sharedItem: SharedItem | null;
  open: boolean;
  onClose: () => void;
}

export default function ManageSharingDialog({
  sharedItem,
  open,
  onClose,
}: ManageSharingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="overflow-hidden mr-10">
          <DialogTitle className="truncate overflow-hidden text-wrap">
            Manage Sharing for {sharedItem?.userFile.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">hello</div>
      </DialogContent>
    </Dialog>
  );
}
