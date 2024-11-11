import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
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

  const limit = parseInt(req.query.limit as string) || 10; // Default limit to 10
  const page = parseInt(req.query.page as string) || 1; // Default page to 1
  const skip = (page - 1) * limit;

  console.log(`Getting files for user ${user}`);

  try {
    const files = await prisma.userFile.findMany({
      where: {
        user: {
          authId: user,
        },
      },
      take: limit,
      skip: skip,
    });
    res.status(200).json(files);
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
