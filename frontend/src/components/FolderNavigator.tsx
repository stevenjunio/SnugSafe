import { ChevronRight, Home, Folder as FolderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useFolderBreadcrumbs } from "../hooks/useEnhancedFiles";

interface FolderNavigatorProps {
  currentFolderId: string | null;
  onNavigate: (folderId: string | null) => void;
}

export default function FolderNavigator({
  currentFolderId,
  onNavigate,
}: FolderNavigatorProps) {
  const { data: breadcrumbs = [], isLoading } = useFolderBreadcrumbs(
    currentFolderId || ""
  );

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 overflow-x-auto">
      {/* Home/Root */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate(null)}
        className={`gap-1 ${!currentFolderId ? "text-blue-600 font-medium" : ""}`}
      >
        <Home className="h-4 w-4" />
        Home
      </Button>

      {/* Breadcrumb trail */}
      {currentFolderId && !isLoading && breadcrumbs.length > 0 && (
        <>
          {breadcrumbs.map((folder, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={folder.id} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(folder.id)}
                  className={`gap-1 ${isLast ? "text-blue-600 font-medium" : ""}`}
                >
                  <FolderIcon className="h-4 w-4" />
                  {folder.name}
                </Button>
              </div>
            );
          })}
        </>
      )}

      {isLoading && currentFolderId && (
        <div className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  );
}
