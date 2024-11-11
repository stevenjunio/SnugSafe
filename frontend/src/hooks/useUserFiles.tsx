import { FileItem } from "@/types/file.types";
import { useQuery } from "@tanstack/react-query";

export function useUserFiles() {
  return useQuery({
    queryKey: ["userFiles"],
    queryFn: async (): Promise<FileItem[]> => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/files?user=usr-4245673388096382210&page=1`
      );
      return response.json();
    },
  });
}
