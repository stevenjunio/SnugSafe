import { Router } from "express";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  addTagToFile,
  removeTagFromFile,
  getFilesByTag,
} from "./tag.controller";

const tagRouter = Router();

// Tag CRUD
tagRouter.get("/tags", getTags);
tagRouter.post("/tag", createTag);
tagRouter.put("/tag/:id", updateTag);
tagRouter.delete("/tag/:id", deleteTag);

// File-Tag associations
tagRouter.post("/tag/file", addTagToFile);
tagRouter.delete("/tag/file", removeTagFromFile);
tagRouter.get("/tag/:tagId/files", getFilesByTag);

export default tagRouter;
