import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FileAccessManager } from "./file.service";
import getUserByUsername from "../../../utils/getUserByUsername";
import { corbadoSDK } from "../../../utils/corbado";
const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

// Create a controller for the file upload route
export const createFileController = async (req: Request, res: Response) => {
  // Log headers
  console.log("Headers:", req.headers);

  const name = req.body.name;
  const type = req.body.type;
  const user = req.body.user;
  const key = req.body.key;

  // Log body
  console.log("Body:", req.body);

  try {
    const newFile = await prisma.userFile.create({
      data: {
        type: type,
        id: key,
        name: name,
        size: req.body.size,
        user: {
          connect: {
            authId: user,
          },
        },
      },
    });
    res.status(200).json(newFile); // Send the response with status 200 and the new file data
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating file" }); // Send the error response with status 500
  }
};

export const getFileController = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`Getting file with id ${id}`);

  try {
    const file = await prisma.userFile.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json(file);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting file" });
  }
};

export const getFilesController = async (req: Request, res: Response) => {
  const user = req.query.user as string;
  const search = req.query.search as string;
  const folderId = req.query.folderId as string;
  const tags = req.query.tags as string; // comma-separated tag IDs
  const fileTypes = req.query.fileTypes as string; // comma-separated file types
  const sortBy = req.query.sortBy as string || "name"; // name, uploadDate, size, type
  const sortOrder = req.query.sortOrder as string || "asc"; // asc, desc

  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 100
  const page = parseInt(req.query.page as string) || 1; // Default page to 1
  const skip = (page - 1) * limit;

  console.log(`Getting files for user ${user}`);

  try {
    // Build where clause
    const whereClause: any = {
      user: {
        authId: user,
      },
    };

    // Add folder filter
    if (folderId) {
      whereClause.folderId = folderId;
    } else if (req.query.rootOnly === "true") {
      whereClause.folderId = null;
    }

    // Add search filter
    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Add file type filter
    if (fileTypes) {
      const types = fileTypes.split(",");
      whereClause.type = {
        in: types,
      };
    }

    // Add tag filter
    if (tags) {
      const tagIds = tags.split(",");
      whereClause.fileTags = {
        some: {
          tagId: {
            in: tagIds,
          },
        },
      };
    }

    // Build orderBy clause
    const orderByClause: any = {};
    if (sortBy === "uploadDate") {
      orderByClause.uploadDate = sortOrder;
    } else if (sortBy === "size") {
      orderByClause.size = sortOrder;
    } else if (sortBy === "type") {
      orderByClause.type = sortOrder;
    } else {
      orderByClause.name = sortOrder;
    }

    const files = await prisma.userFile.findMany({
      where: whereClause,
      include: {
        fileTags: {
          include: {
            tag: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: orderByClause,
      take: limit,
      skip: skip,
    });

    // Get total count for pagination
    const total = await prisma.userFile.count({
      where: whereClause,
    });

    res.status(200).json({ files, total, page, limit });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting files" });
  }
};

export const deleteFileController = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`Deleting file with id ${id}`);

  try {
    const file = await prisma.userFile.delete({
      where: {
        id: id,
      },
    });
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.id,
    });
    console.log(`Deleting file from S3 with key ${file.id}`);
    const deleteResponse = await s3Client.send(deleteCommand);
    console.log(`S3 response:`, deleteResponse);
    res.status(200).json(file);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting file" });
  }
};

export const postShareRequestController = async (
  req: Request,
  res: Response
) => {
  const { fileId, username } = req.body;

  if (!fileId || !username) {
    res.status(400).json({ error: "Missing fileId or username" });
    return;
  }
  try {
    console.log(`Sharing file ${fileId} with ${username} and access levelsss`);
    const fileAccessManager = new FileAccessManager();

    //generate a key from the fileAccessManager
    const key = await fileAccessManager.generateKeyFromBubbleLamp();

    console.log(`the fileKey from the BubbleLamp key is:`, key);

    const user = await getUserByUsername(username);

    //save the key to the user in the db
    const fileKey = await prisma.userFileKey.create({
      data: {
        key: key,
        userFile: {
          connect: {
            id: fileId,
          },
        },
        user: {
          connect: {
            authId: user,
          },
        },
      },
    });
    if (!fileKey) {
      res.status(400).json({ error: "Error saving key" });
      return;
    }

    // Share the file with the user
    const newFileShare = await fileAccessManager.shareFileWithUser(
      username,
      fileId
    );
    console.log(`the new fileshare is:`, newFileShare);
    //@ts-ignore because for some reason types aren't working
    if (newFileShare?.error) {
      res.status(400).json({ error: newFileShare });
      return;
    }
    res.status(200).json({ fileShare: newFileShare });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error sharing file" });
  }
};

export const getSharedFilesController = async (req: Request, res: Response) => {
  const { userID } = req.query;
  console.log(`Getting shared files for user ${userID}`);
  if (!userID || typeof userID !== "string") {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const sharedFiles = await prisma.fileShare.findMany({
      where: {
        OR: [
          {
            sharedTo: { authId: userID },
          },
          {
            userFile: {
              user: {
                authId: userID,
              },
            },
          },
        ],
      },
      include: {
        userFile: {
          select: {
            user: {
              select: {
                userName: true,
              },
            },
            name: true,
            id: true,
            type: true,
          },
        },
        sharedTo: {
          select: {
            userName: true,
            authId: true,
            id: true,
          },
        },
      },
    });
    console.log(`Shared files:`, sharedFiles);

    // add in the username

    res.status(200).json(sharedFiles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting shared files" });
  }
};

export const getSharedFileController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const headers = req.headers;
  const authHeader = headers.authorization;
  console.log(`Getting shared file with id ${id}`);
  console.log(`the cookies are:`, req.cookies);
  console.log(`the headers are:`, headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    // Get the user from Corbado
    const user = await corbadoSDK
      .sessions()
      .validateToken(authHeader.split("Bearer ")[1]);

    if (!user) {
      console.error("Unauthorized: User not found");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if the user has access to the file via the keys in the DB
    const sharedFile = await prisma.fileShare.findUnique({
      where: {
        id: id,
      },
      include: {
        userFile: {
          select: {
            user: {
              select: {
                userName: true,
                authId: true,
              },
            },
            name: true,
            id: true,
            type: true,
          },
        },
      },
    });

    if (!sharedFile) {
      console.error("File not found");
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Allow access if the shared file's creator is the user itself
    if (sharedFile.userFile.user.authId === user.userId) {
      res.status(200).json(sharedFile);
      return;
    }

    const fileAccessKey = await prisma.userFileKey.findFirst({
      where: {
        userFile: {
          id: sharedFile.userFile.id,
        },
        user: {
          authId: user.userId,
        },
      },
    });

    if (fileAccessKey) {
      res.status(200).json(sharedFile);
    } else {
      console.error("Unauthorized: No valid file access key");
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error("Error getting shared file:", err);
    res.status(500).json({ error: "Error getting shared file" });
  }
};

export const deleteFileShareController = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  console.log(`Deleting file share with id ${id}`);

  try {
    const fileShare = await prisma.fileShare.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(fileShare);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting file share" });
  }
};

// Bulk operations
export const bulkDeleteFilesController = async (req: Request, res: Response) => {
  const { fileIds } = req.body;

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    res.status(400).json({ error: "fileIds array is required" });
    return;
  }

  console.log(`Bulk deleting ${fileIds.length} files`);

  try {
    // Get files to delete from S3
    const files = await prisma.userFile.findMany({
      where: {
        id: {
          in: fileIds,
        },
      },
    });

    // Delete from database
    const deleteResult = await prisma.userFile.deleteMany({
      where: {
        id: {
          in: fileIds,
        },
      },
    });

    // Delete from S3
    const s3DeletePromises = files.map((file) => {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.id,
      });
      return s3Client.send(deleteCommand);
    });

    await Promise.all(s3DeletePromises);

    res.status(200).json({
      message: `Successfully deleted ${deleteResult.count} files`,
      count: deleteResult.count
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error bulk deleting files" });
  }
};

export const bulkMoveFilesController = async (req: Request, res: Response) => {
  const { fileIds, folderId } = req.body;

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    res.status(400).json({ error: "fileIds array is required" });
    return;
  }

  console.log(`Bulk moving ${fileIds.length} files to folder ${folderId || "root"}`);

  try {
    const updateResult = await prisma.userFile.updateMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      data: {
        folderId: folderId || null,
      },
    });

    res.status(200).json({
      message: `Successfully moved ${updateResult.count} files`,
      count: updateResult.count
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error bulk moving files" });
  }
};

export const bulkTagFilesController = async (req: Request, res: Response) => {
  const { fileIds, tagId } = req.body;

  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    res.status(400).json({ error: "fileIds array is required" });
    return;
  }

  if (!tagId) {
    res.status(400).json({ error: "tagId is required" });
    return;
  }

  console.log(`Bulk tagging ${fileIds.length} files with tag ${tagId}`);

  try {
    // Create file tags for all files, skip if already exists
    const createPromises = fileIds.map((fileId) =>
      prisma.fileTag.upsert({
        where: {
          fileId_tagId: {
            fileId,
            tagId,
          },
        },
        create: {
          fileId,
          tagId,
        },
        update: {}, // Do nothing if already exists
      })
    );

    const results = await Promise.all(createPromises);

    res.status(200).json({
      message: `Successfully tagged ${results.length} files`,
      count: results.length
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error bulk tagging files" });
  }
};

// Update file to move it to a folder
export const updateFileController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { folderId, name } = req.body;

  console.log(`Updating file ${id}`);

  try {
    const updateData: any = {};

    if (folderId !== undefined) {
      updateData.folderId = folderId;
    }

    if (name) {
      updateData.name = name;
    }

    const file = await prisma.userFile.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        fileTags: {
          include: {
            tag: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(file);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating file" });
  }
};
