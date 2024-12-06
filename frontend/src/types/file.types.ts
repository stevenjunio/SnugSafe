// src/features/files/types/file.types.ts
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
