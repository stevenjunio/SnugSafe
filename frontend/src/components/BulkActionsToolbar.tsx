import { useState } from "react";
import { Button } from "./ui/button";
import {
  Trash2,
  FolderInput,
  Tag as TagIcon,
  X,
  CheckSquare,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Tag, Folder } from "../types/file.types";
import {
  useBulkDeleteFiles,
  useBulkMoveFiles,
  useBulkTagFiles,
} from "../hooks/useEnhancedFiles";

interface BulkActionsToolbarProps {
  selectedFileIds: string[];
  onClearSelection: () => void;
  availableTags: Tag[];
  availableFolders: Folder[];
}

export default function BulkActionsToolbar({
  selectedFileIds,
  onClearSelection,
  availableTags,
  availableFolders,
}: BulkActionsToolbarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const bulkDelete = useBulkDeleteFiles();
  const bulkMove = useBulkMoveFiles();
  const bulkTag = useBulkTagFiles();

  const handleBulkDelete = async () => {
    try {
      await bulkDelete.mutateAsync(selectedFileIds);
      onClearSelection();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete files:", error);
    }
  };

  if (selectedFileIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {selectedFileIds.length} file{selectedFileIds.length !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Move to folder */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedFolderId || ""}
              onValueChange={(value) => {
                setSelectedFolderId(value);
                // Auto-apply when folder is selected
                setTimeout(() => {
                  if (value) {
                    bulkMove.mutateAsync({
                      fileIds: selectedFileIds,
                      folderId: value === "root" ? null : value,
                    }).then(() => {
                      onClearSelection();
                      setSelectedFolderId(null);
                    });
                  }
                }, 100);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <FolderInput className="h-4 w-4" />
                  <SelectValue placeholder="Move to folder..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Folder</SelectItem>
                {availableFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add tag */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedTagId || ""}
              onValueChange={(value) => {
                setSelectedTagId(value);
                // Auto-apply when tag is selected
                setTimeout(() => {
                  if (value) {
                    bulkTag.mutateAsync({
                      fileIds: selectedFileIds,
                      tagId: value,
                    }).then(() => {
                      setSelectedTagId(null);
                    });
                  }
                }, 100);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  <SelectValue placeholder="Add tag..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableTags.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    No tags available
                  </div>
                ) : (
                  availableTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        {tag.color && (
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                        )}
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={bulkDelete.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>

          {/* Clear selection */}
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedFileIds.length} files?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected files
              from your storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
