import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Create a controller for the folder creation route
export const createFolderController = async (req: Request, res: Response) => {
  // Log headers
  console.log("Headers:", req.headers);

  const name = req.body.name;
  const user = req.body.user;
  const parentFolderId = req.body.parentFolderId;

  // Log body
  console.log("Body:", req.body);

  try {
    const newFolder = await prisma.userFolder.create({
      data: {
        name: name,
        parentFolderId: parentFolderId || null,
        user: {
          connect: {
            authId: user,
          },
        },
      },
    });

    res.status(200).json(newFolder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating folder" });
  }
};

export const deleteFolderController = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(422).json({ error: "Folder ID is required" });
    return;
  }
  console.log(`the id we're trying to delete is`, id);

  try {
    const data = await prisma.userFolder.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting folder" });
  }
};

// Get all folders for a user
export const getFoldersController = async (req: Request, res: Response) => {
  const user = req.query.user as string;
  const parentFolderId = req.query.parentFolderId as string;

  if (!user) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  console.log(`Getting folders for user ${user}`);

  try {
    const whereClause: any = {
      userId: user,
    };

    // Filter by parent folder if specified
    if (parentFolderId) {
      whereClause.parentFolderId = parentFolderId;
    } else if (req.query.rootOnly === "true") {
      whereClause.parentFolderId = null;
    }

    const folders = await prisma.userFolder.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            childrenFolder: true,
            files: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(folders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting folders" });
  }
};

// Get a single folder with its contents
export const getFolderController = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Folder ID is required" });
    return;
  }

  console.log(`Getting folder ${id}`);

  try {
    const folder = await prisma.userFolder.findUnique({
      where: {
        id: id,
      },
      include: {
        childrenFolder: {
          include: {
            _count: {
              select: {
                childrenFolder: true,
                files: true,
              },
            },
          },
        },
        files: {
          include: {
            fileTags: {
              include: {
                tag: true,
              },
            },
          },
        },
        parentFolder: true,
      },
    });

    if (!folder) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    res.status(200).json(folder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting folder" });
  }
};

// Get folder breadcrumb path
export const getFolderBreadcrumbsController = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Folder ID is required" });
    return;
  }

  console.log(`Getting breadcrumbs for folder ${id}`);

  try {
    const breadcrumbs: any[] = [];
    let currentFolder = await prisma.userFolder.findUnique({
      where: { id },
      include: { parentFolder: true },
    });

    // Traverse up the folder tree
    while (currentFolder) {
      breadcrumbs.unshift({
        id: currentFolder.id,
        name: currentFolder.name,
      });

      if (currentFolder.parentFolderId) {
        currentFolder = await prisma.userFolder.findUnique({
          where: { id: currentFolder.parentFolderId },
          include: { parentFolder: true },
        });
      } else {
        currentFolder = null;
      }
    }

    res.status(200).json(breadcrumbs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting folder breadcrumbs" });
  }
};

// Update folder
export const updateFolderController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, parentFolderId } = req.body;

  if (!id) {
    res.status(400).json({ error: "Folder ID is required" });
    return;
  }

  console.log(`Updating folder ${id}`);

  try {
    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    if (parentFolderId !== undefined) {
      updateData.parentFolderId = parentFolderId;
    }

    const folder = await prisma.userFolder.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(folder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating folder" });
  }
};
