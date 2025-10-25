import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserFile, FilesResponse, Folder } from "../types/file.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Enhanced file fetching with search, filter, and sorting
export function useEnhancedFiles(params: {
  userId: string;
  search?: string;
  folderId?: string | null;
  tags?: string[];
  fileTypes?: string[];
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  rootOnly?: boolean;
}) {
  const queryParams = new URLSearchParams();
  queryParams.append("user", params.userId);

  if (params.search) queryParams.append("search", params.search);
  if (params.folderId) queryParams.append("folderId", params.folderId);
  if (params.tags && params.tags.length > 0)
    queryParams.append("tags", params.tags.join(","));
  if (params.fileTypes && params.fileTypes.length > 0)
    queryParams.append("fileTypes", params.fileTypes.join(","));
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.rootOnly) queryParams.append("rootOnly", "true");

  return useQuery({
    queryKey: ["files", params],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/files?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      return response.json() as Promise<FilesResponse>;
    },
    enabled: !!params.userId,
  });
}

// Bulk delete files
export function useBulkDeleteFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/files/bulk/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete files");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}

// Bulk move files
export function useBulkMoveFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileIds,
      folderId,
    }: {
      fileIds: string[];
      folderId?: string | null;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/files/bulk/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds, folderId }),
      });
      if (!response.ok) {
        throw new Error("Failed to move files");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}

// Bulk tag files
export function useBulkTagFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileIds, tagId }: { fileIds: string[]; tagId: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/files/bulk/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds, tagId }),
      });
      if (!response.ok) {
        throw new Error("Failed to tag files");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}

// Update file (move to folder, rename)
export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      folderId,
      name,
    }: {
      id: string;
      folderId?: string | null;
      name?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/file/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId, name }),
      });
      if (!response.ok) {
        throw new Error("Failed to update file");
      }
      return response.json() as Promise<UserFile>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}

// Enhanced folder hooks
export function useFolders(userId: string, parentFolderId?: string | null, rootOnly?: boolean) {
  const queryParams = new URLSearchParams();
  queryParams.append("user", userId);
  if (parentFolderId) queryParams.append("parentFolderId", parentFolderId);
  if (rootOnly) queryParams.append("rootOnly", "true");

  return useQuery({
    queryKey: ["folders", userId, parentFolderId, rootOnly],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/folders?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }
      return response.json() as Promise<Folder[]>;
    },
    enabled: !!userId,
  });
}

export function useFolder(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/folder/${folderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch folder");
      }
      return response.json() as Promise<Folder>;
    },
    enabled: !!folderId,
  });
}

export function useFolderBreadcrumbs(folderId: string) {
  return useQuery({
    queryKey: ["breadcrumbs", folderId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/folder/${folderId}/breadcrumbs`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch breadcrumbs");
      }
      return response.json() as Promise<{ id: string; name: string }[]>;
    },
    enabled: !!folderId,
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      parentFolderId,
    }: {
      id: string;
      name?: string;
      parentFolderId?: string | null;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/folder/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentFolderId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update folder");
      }
      return response.json() as Promise<Folder>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folder"] });
      queryClient.invalidateQueries({ queryKey: ["breadcrumbs"] });
    },
  });
}
