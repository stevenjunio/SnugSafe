// src/features/files/types/file.types.ts

export type Tag = {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  _count?: {
    fileTags: number;
  };
};

export type FileTag = {
  id: string;
  fileId: string;
  tagId: string;
  tag: Tag;
};

export type Folder = {
  id: string;
  name: string;
  parentFolderId?: string | null;
  userId: string;
  createdAt: string;
  parentFolder?: Folder | null;
  childrenFolder?: Folder[];
  files?: UserFile[];
  _count?: {
    childrenFolder: number;
    files: number;
  };
};

export type UserFile = {
  id: string;
  userId: string;
  name: string;
  size: number;
  type: string;
  folderId?: string | null;
  folder?: {
    id: string;
    name: string;
  } | null;
  uploadDate: string;
  lastModified: string;
  fileTags?: FileTag[];
};

export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
};

export type FileSystem = {
  id: string;
  itemType: "folder" | "file";
  name: string;
  size?: number;
  type?: string;
};

export type FileShare = {
  id: string;
  userFileID: string;
  userSharedToID: string;
  userFile: {
    user: {
      userName: string;
    };
    name: string;
    id: string;
    type: string;
  };
};

export type SharedItem = {
  id: string;
  userFileID: string;
  userSharedToID: string;
  userFile: {
    user: {
      userName: string;
    };
    name: string;
    id: string;
    type: "file" | "folder";
  };
  sharedTo: {
    userName: string;
    authId: string;
    id: string;
  };
};

export type FilesResponse = {
  files: UserFile[];
  total: number;
  page: number;
  limit: number;
};

export type ViewMode = "grid" | "list";

export type SortBy = "name" | "uploadDate" | "size" | "type";
export type SortOrder = "asc" | "desc";
