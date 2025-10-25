import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tag, Trash2, Edit2, Plus, Tags as TagsIcon } from "lucide-react";
import { useTags, useCreateTag, useDeleteTag, useUpdateTag } from "../hooks/useTags";

interface TagManagerProps {
  userId: string;
}

const TAG_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
];

export default function TagManager({ userId }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color?: string } | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  const { data: tags = [], isLoading } = useTags(userId);
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const updateTag = useUpdateTag();

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag.mutateAsync({
        name: newTagName.trim(),
        color: newTagColor,
        userId,
      });
      setNewTagName("");
      setNewTagColor(TAG_COLORS[0]);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return;

    try {
      await updateTag.mutateAsync({
        id: editingTag.id,
        name: editingTag.name.trim(),
        color: editingTag.color,
        userId,
      });
      setEditingTag(null);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag? It will be removed from all files.")) {
      return;
    }

    try {
      await deleteTag.mutateAsync({ id: tagId, userId });
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TagsIcon className="h-4 w-4" />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create, edit, and delete tags to organize your files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {/* Create new tag */}
          {isCreating ? (
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label htmlFor="new-tag-name">Tag Name</Label>
                <Input
                  id="new-tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateTag();
                    }
                  }}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        newTagColor === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create New Tag
            </Button>
          )}

          {/* Tags list */}
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-gray-500 text-center py-4">Loading tags...</p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No tags yet. Create your first tag above!
              </p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  {editingTag?.id === tag.id ? (
                    <div className="flex-1 space-y-3">
                      <div>
                        <Input
                          value={editingTag.name}
                          onChange={(e) =>
                            setEditingTag({ ...editingTag, name: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateTag();
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full transition-transform ${
                              editingTag.color === color
                                ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              setEditingTag({ ...editingTag, color })
                            }
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateTag}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTag(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {tag.color && (
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                        )}
                        <span className="font-medium">{tag.name}</span>
                        {tag._count && (
                          <Badge variant="secondary" className="text-xs">
                            {tag._count.fileTags} files
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingTag({ id: tag.id, name: tag.name, color: tag.color })
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
