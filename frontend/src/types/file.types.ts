// src/features/files/types/file.types.ts
export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
};
