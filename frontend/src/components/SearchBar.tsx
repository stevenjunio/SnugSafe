import { useState } from "react";
import { Search, Filter, X, FileType, Tag as TagIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Tag } from "../types/file.types";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedFileTypes: string[];
  onFileTypesChange: (types: string[]) => void;
  availableTags: Tag[];
  onClearFilters: () => void;
}

const FILE_TYPES = [
  { value: "application/pdf", label: "PDF" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/gif", label: "GIF" },
  { value: "video/mp4", label: "Video" },
  { value: "audio/mpeg", label: "Audio" },
  { value: "application/zip", label: "ZIP" },
  {
    value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    label: "Word",
  },
  {
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    label: "Excel",
  },
];

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  selectedFileTypes,
  onFileTypesChange,
  availableTags,
  onClearFilters,
}: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters =
    selectedTags.length > 0 || selectedFileTypes.length > 0 || searchTerm.length > 0;

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleFileTypeToggle = (type: string) => {
    if (selectedFileTypes.includes(type)) {
      onFileTypesChange(selectedFileTypes.filter((t) => t !== type));
    } else {
      onFileTypesChange([...selectedFileTypes, type]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {selectedTags.length + selectedFileTypes.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon className="h-4 w-4" />
                  <h4 className="font-semibold text-sm">Tags</h4>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableTags.length === 0 ? (
                    <p className="text-sm text-gray-500">No tags available</p>
                  ) : (
                    availableTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagToggle(tag.id)}
                        />
                        <Label
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-normal cursor-pointer flex items-center gap-2"
                        >
                          {tag.color && (
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                          )}
                          {tag.name}
                          {tag._count && (
                            <span className="text-xs text-gray-400">
                              ({tag._count.fileTags})
                            </span>
                          )}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileType className="h-4 w-4" />
                  <h4 className="font-semibold text-sm">File Types</h4>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {FILE_TYPES.map((fileType) => (
                    <div key={fileType.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${fileType.value}`}
                        checked={selectedFileTypes.includes(fileType.value)}
                        onCheckedChange={() => handleFileTypeToggle(fileType.value)}
                      />
                      <Label
                        htmlFor={`type-${fileType.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {fileType.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClearFilters();
                      setIsFilterOpen(false);
                    }}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = availableTags.find((t) => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge
                key={tagId}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-gray-200"
                onClick={() => handleTagToggle(tagId)}
              >
                {tag.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                )}
                {tag.name}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
          {selectedFileTypes.map((type) => {
            const fileType = FILE_TYPES.find((ft) => ft.value === type);
            if (!fileType) return null;
            return (
              <Badge
                key={type}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-gray-200"
                onClick={() => handleFileTypeToggle(type)}
              >
                {fileType.label}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
