import { useState } from "react";
import { useCorbado } from "@corbado/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderPlus, Upload } from "lucide-react";
import uploadFile from "@/lib/uploadFile";
import { Button } from "./ui/button";
import { FileUpload } from "./FileUpload";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { BunnyRunner } from "./ui/BunnyRunner";
import SearchBar from "./SearchBar";
import TagManager from "./TagManager";
import BulkActionsToolbar from "./BulkActionsToolbar";
import FolderNavigator from "./FolderNavigator";
import EnhancedFileList from "./EnhancedFileList";
import FileSharingDialog from "./FileSharingDialog";
import { useEnhancedFiles, useFolders } from "@/hooks/useEnhancedFiles";
import { useTags } from "@/hooks/useTags";
import { ViewMode, SortBy, SortOrder, UserFile } from "@/types/file.types";
import { openS3File } from "@/lib/openS3File";

export function EnhancedFilePage() {
  const { user } = useCorbado();
  const queryClient = useQueryClient();
  const userId = user?.sub || "";

  // State management
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [fileToShare, setFileToShare] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  // Data fetching
  const {
    data: filesData,
    isLoading: isLoadingFiles,
    isError: isFilesError,
  } = useEnhancedFiles({
    userId,
    search: searchTerm,
    folderId: currentFolderId,
    tags: selectedTags,
    fileTypes: selectedFileTypes,
    sortBy,
    sortOrder,
    rootOnly: currentFolderId === null,
  });

  const { data: folders = [] } = useFolders(userId, currentFolderId, !currentFolderId);
  const { data: tags = [] } = useTags(userId);

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadFile(file, currentFolderId || "/", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFileMutation.mutateAsync(file);
    }
    event.target.value = "";
  };

  const handleFileClick = async (file: UserFile) => {
    try {
      await openS3File(file.id, file.name);
    } catch (error) {
      console.error("Failed to open file:", error);
    }
  };

  const handleFolderClick = (folder: any) => {
    setCurrentFolderId(folder.id);
    setSelectedFileIds([]); // Clear selection when changing folders
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedFileTypes([]);
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/file/${fileId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["files"] });
        queryClient.invalidateQueries({ queryKey: ["filesystem"] });
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const files = filesData?.files || [];
  const hasActiveFilters = selectedTags.length > 0 || selectedFileTypes.length > 0 || searchTerm.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 justify-between items-start sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Your Files</h1>
          <div className="flex flex-wrap gap-2">
            <TagManager userId={userId} />
            <CreateFolderDialog />
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>

        {/* Breadcrumb navigation */}
        <FolderNavigator
          currentFolderId={currentFolderId}
          onNavigate={setCurrentFolderId}
        />

        {/* Search and filters */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          selectedFileTypes={selectedFileTypes}
          onFileTypesChange={setSelectedFileTypes}
          availableTags={tags}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk actions toolbar */}
        <BulkActionsToolbar
          selectedFileIds={selectedFileIds}
          onClearSelection={() => setSelectedFileIds([])}
          availableTags={tags}
          availableFolders={folders}
        />
      </div>

      {/* Upload progress */}
      {uploadFileMutation.isPending && (
        <BunnyRunner fileName={uploadFileMutation.variables?.name || "file"} />
      )}

      {/* File list */}
      {isLoadingFiles ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      ) : isFilesError ? (
        <div className="text-center py-12 text-red-600">
          <p>Error loading files. Please try again.</p>
        </div>
      ) : files.length === 0 && folders.length === 0 && !hasActiveFilters ? (
        <div className="text-center py-12 text-gray-500">
          <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No files yet</h3>
          <p className="mb-4">Upload your first file to get started</p>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      ) : files.length === 0 && folders.length === 0 && hasActiveFilters ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No files match your filters</p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <EnhancedFileList
          files={files}
          folders={folders}
          selectedFileIds={selectedFileIds}
          onSelectionChange={setSelectedFileIds}
          onFileClick={handleFileClick}
          onFolderClick={handleFolderClick}
          onFileDelete={handleFileDelete}
          onFileShare={(fileId) => setFileToShare(fileId)}
          availableTags={tags}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      )}

      {/* Pagination info */}
      {filesData && filesData.total > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {files.length} of {filesData.total} files
        </div>
      )}

      {/* File sharing dialog */}
      {fileToShare && (
        <FileSharingDialog
          fileId={fileToShare}
          onClose={() => setFileToShare(null)}
        />
      )}
    </div>
  );
}
