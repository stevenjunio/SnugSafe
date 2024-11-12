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
export const createFolderController = async (req: Request, res: Response) => {
  // Log headers
  console.log("Headers:", req.headers);

  const name = req.body.name;
  const user = req.body.user;
  const key = req.body.key;

  // Log body
  console.log("Body:", req.body);

  try {
    const newFolder = await prisma.userFolder.create({
      data: {
        name: "name",
        user: {
          connect: {
            authId: user,
          },
        },
      },
    });

    res.status(200).json(newFolder); // Send the response with status 200 and the new file data
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating file" }); // Send the error response with status 500
  }
};
