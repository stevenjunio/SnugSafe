import { Request, Response } from "express";
import prisma from "../../../lib/prisma";

// Get all tags for a user
export const getTags = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const tags = await prisma.tag.findMany({
      where: { userId },
      include: {
        _count: {
          select: { fileTags: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Create a new tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "name and userId are required" });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || null,
        userId,
      },
    });

    return res.status(201).json(tag);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Tag with this name already exists" });
    }
    console.error("Error creating tag:", error);
    return res.status(500).json({ error: "Failed to create tag" });
  }
};

// Update a tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
      },
    });

    return res.status(200).json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return res.status(500).json({ error: "Failed to update tag" });
  }
};

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tag.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({ error: "Failed to delete tag" });
  }
};

// Add tag to file
export const addTagToFile = async (req: Request, res: Response) => {
  try {
    const { fileId, tagId } = req.body;

    if (!fileId || !tagId) {
      return res.status(400).json({ error: "fileId and tagId are required" });
    }

    const fileTag = await prisma.fileTag.create({
      data: {
        fileId,
        tagId,
      },
      include: {
        tag: true,
      },
    });

    return res.status(201).json(fileTag);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "File already has this tag" });
    }
    console.error("Error adding tag to file:", error);
    return res.status(500).json({ error: "Failed to add tag to file" });
  }
};

// Remove tag from file
export const removeTagFromFile = async (req: Request, res: Response) => {
  try {
    const { fileId, tagId } = req.body;

    if (!fileId || !tagId) {
      return res.status(400).json({ error: "fileId and tagId are required" });
    }

    await prisma.fileTag.deleteMany({
      where: {
        fileId,
        tagId,
      },
    });

    return res.status(200).json({ message: "Tag removed from file successfully" });
  } catch (error) {
    console.error("Error removing tag from file:", error);
    return res.status(500).json({ error: "Failed to remove tag from file" });
  }
};

// Get files by tag
export const getFilesByTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const fileTags = await prisma.fileTag.findMany({
      where: {
        tagId,
        file: {
          userId,
        },
      },
      include: {
        file: {
          include: {
            fileTags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    const files = fileTags.map((ft) => ft.file);
    return res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files by tag:", error);
    return res.status(500).json({ error: "Failed to fetch files by tag" });
  }
};
