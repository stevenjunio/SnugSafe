import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag } from "../types/file.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Get all tags for a user
export function useTags(userId: string) {
  return useQuery({
    queryKey: ["tags", userId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tags?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return response.json() as Promise<Tag[]>;
    },
    enabled: !!userId,
  });
}

// Create a new tag
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color?: string; userId: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      return response.json() as Promise<Tag>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tags", variables.userId] });
    },
  });
}

// Update a tag
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      color,
      userId,
    }: {
      id: string;
      name?: string;
      color?: string;
      userId: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/tag/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
      return response.json() as Promise<Tag>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tags", variables.userId] });
    },
  });
}

// Delete a tag
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/tag/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tags", variables.userId] });
    },
  });
}

// Add tag to file
export function useAddTagToFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileId, tagId }: { fileId: string; tagId: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/tag/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, tagId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add tag to file");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}

// Remove tag from file
export function useRemoveTagFromFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileId, tagId }: { fileId: string; tagId: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/tag/file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, tagId }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove tag from file");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["filesystem"] });
    },
  });
}
