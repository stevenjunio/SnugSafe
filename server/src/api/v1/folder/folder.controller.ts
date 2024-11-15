import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

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
        name: name,
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

export const deleteFolderController = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(422);
  }
  console.log(`the id we're trying to delete is`, id);
  const data = await prisma.userFolder.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json(data);
};
