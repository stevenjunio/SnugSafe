import { useState } from "react";
import {
  FileIcon,
  FolderIcon,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  Tag as TagIcon,
  Grid3x3,
  List,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserFile, Folder, Tag, ViewMode, SortBy, SortOrder } from "../types/file.types";
import { useUpdateFile } from "../hooks/useEnhancedFiles";
import { useAddTagToFile, useRemoveTagFromFile } from "../hooks/useTags";
import { formatBytes } from "../lib/utils";

interface EnhancedFileListProps {
  files: UserFile[];
  folders: Folder[];
  selectedFileIds: string[];
  onSelectionChange: (fileIds: string[]) => void;
  onFileClick: (file: UserFile) => void;
  onFolderClick: (folder: Folder) => void;
  onFileDelete: (fileId: string) => void;
  onFileShare: (fileId: string) => void;
  availableTags: Tag[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

export default function EnhancedFileList({
  files,
  folders,
  selectedFileIds,
  onSelectionChange,
  onFileClick,
  onFolderClick,
  onFileDelete,
  onFileShare,
  availableTags,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: EnhancedFileListProps) {
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const updateFile = useUpdateFile();
  const addTagToFile = useAddTagToFile();
  const removeTagFromFile = useRemoveTagFromFile();

  const handleSelectAll = () => {
    if (selectedFileIds.length === files.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(files.map((f) => f.id));
    }
  };

  const handleFileSelect = (fileId: string) => {
    if (selectedFileIds.includes(fileId)) {
      onSelectionChange(selectedFileIds.filter((id) => id !== fileId));
    } else {
      onSelectionChange([...selectedFileIds, fileId]);
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    if (!draggedFile) return;

    try {
      await updateFile.mutateAsync({
        id: draggedFile,
        folderId: targetFolderId,
      });
    } catch (error) {
      console.error("Failed to move file:", error);
    }

    setDraggedFile(null);
    setDropTarget(null);
  };

  const handleFolderDragEnter = (folderId: string) => {
    setDropTarget(folderId);
  };

  const handleFolderDragLeave = () => {
    setDropTarget(null);
  };

  const handleAddTag = async (fileId: string, tagId: string) => {
    try {
      await addTagToFile.mutateAsync({ fileId, tagId });
    } catch (error) {
      console.error("Failed to add tag:", error);
    }
  };

  const handleRemoveTag = async (fileId: string, tagId: string) => {
    try {
      await removeTagFromFile.mutateAsync({ fileId, tagId });
    } catch (error) {
      console.error("Failed to remove tag:", error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎵";
    if (type.includes("zip") || type.includes("compressed")) return "📦";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
    if (type.includes("powerpoint") || type.includes("presentation")) return "📽️";
    return "📁";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedFileIds.length === files.length && files.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select All ({files.length})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort controls */}
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="uploadDate">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>

          {/* View mode toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-2"
          }
        >
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`group cursor-pointer border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                dropTarget === folder.id ? "bg-blue-50 border-blue-300" : ""
              }`}
              onClick={() => onFolderClick(folder)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, folder.id)}
              onDragEnter={() => handleFolderDragEnter(folder.id)}
              onDragLeave={handleFolderDragLeave}
            >
              <div className={viewMode === "grid" ? "text-center" : "flex items-center gap-3"}>
                <div className={viewMode === "grid" ? "mb-2" : ""}>
                  <FolderIcon
                    className={`${
                      viewMode === "grid" ? "h-12 w-12 mx-auto" : "h-8 w-8"
                    } text-blue-500`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{folder.name}</p>
                  {folder._count && (
                    <p className="text-xs text-gray-500">
                      {folder._count.files} files, {folder._count.childrenFolder} folders
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files */}
      {files.length === 0 && folders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FolderIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No files or folders here</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <FileIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No files in this folder</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-2"
          }
        >
          {files.map((file) => (
            <div
              key={file.id}
              className={`group border rounded-lg p-4 transition-all ${
                selectedFileIds.includes(file.id)
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50"
              } ${draggedFile === file.id ? "opacity-50" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, file.id)}
            >
              <div className={viewMode === "grid" ? "text-center" : "flex items-start gap-3"}>
                {/* Checkbox */}
                <div
                  className={
                    viewMode === "grid"
                      ? "absolute top-2 left-2"
                      : "flex items-center justify-center pt-1"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedFileIds.includes(file.id)}
                    onCheckedChange={() => handleFileSelect(file.id)}
                  />
                </div>

                {/* File icon */}
                <div
                  className={viewMode === "grid" ? "mb-2" : ""}
                  onClick={() => onFileClick(file)}
                >
                  <div
                    className={`${
                      viewMode === "grid" ? "text-5xl" : "text-3xl"
                    } cursor-pointer`}
                  >
                    {getFileIcon(file.type)}
                  </div>
                </div>

                {/* File info */}
                <div className={`flex-1 min-w-0 ${viewMode === "grid" ? "" : "cursor-pointer"}`} onClick={() => viewMode === "list" && onFileClick(file)}>
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)} •{" "}
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </p>

                  {/* Tags */}
                  {file.fileTags && file.fileTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.fileTags.map((fileTag) => (
                        <Badge
                          key={fileTag.id}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(file.id, fileTag.tag.id);
                          }}
                        >
                          {fileTag.tag.color && (
                            <span
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: fileTag.tag.color }}
                            />
                          )}
                          {fileTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions menu */}
                <div className={viewMode === "grid" ? "absolute top-2 right-2" : ""}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onFileClick(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        Open/Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFileShare(file.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>

                      {/* Add tag submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <TagIcon className="h-4 w-4 mr-2" />
                          Add Tag
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {availableTags.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No tags available
                            </div>
                          ) : (
                            availableTags.map((tag) => (
                              <DropdownMenuItem
                                key={tag.id}
                                onClick={() => handleAddTag(file.id, tag.id)}
                                disabled={file.fileTags?.some((ft) => ft.tag.id === tag.id)}
                              >
                                <div className="flex items-center gap-2">
                                  {tag.color && (
                                    <span
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: tag.color }}
                                    />
                                  )}
                                  {tag.name}
                                </div>
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onFileDelete(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
