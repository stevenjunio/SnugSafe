import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

const getFileSystemController = async (req: Request, res: Response) => {
  const headers = req.headers;
  const { user, folder } = req.query as { user: string; folder: string };
  console.log(`the req`, req.params);
  console.log(`the user from query`, user);
  if (!user) {
    res.status(400).json({ error: "User is required" });
    return;
  }

  console.log(`Getting file system for user ${user} and folder ${folder}`);

  const files = await prisma.userFile.findMany({
    where: {
      user: {
        authId: user,
      },
    },
    select: {
      id: true,
      name: true,
      size: true,
      type: true,
    },
  });
  const folders = await prisma.userFolder.findMany({
    select: {
      id: true,
      name: true,
      parentFolderId: true,
    },

    where: {
      user: {
        authId: user,
      },
    },
  });

  console.log(` we found files`, files, folders);
  //join the files and folders with an array
  const fileSystem = [
    ...files.map((file) => ({ ...file, itemType: "file" })),
    ...folders.map((folder) => ({ ...folder, itemType: "folder" })),
  ];
  res.status(200).json(fileSystem); // Send the response with status 200 and the new file data
};

export { getFileSystemController };
