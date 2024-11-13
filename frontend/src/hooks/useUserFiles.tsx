import { FileItem } from "@/types/file.types";
import { useCorbado } from "@corbado/react";
import { useQuery } from "@tanstack/react-query";

export function useUserFiles() {
  const { user } = useCorbado();

  return useQuery({
    queryKey: ["userFiles"],
    queryFn: async (): Promise<FileItem[]> => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/files?user=${user.sub}&page=1`
      );
      return response.json();
    },
  });
}
