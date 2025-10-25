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

const router = Router();

// Tag CRUD
router.get("/tags", getTags);
router.post("/tag", createTag);
router.put("/tag/:id", updateTag);
router.delete("/tag/:id", deleteTag);

// File-Tag associations
router.post("/tag/file", addTagToFile);
router.delete("/tag/file", removeTagFromFile);
router.get("/tag/:tagId/files", getFilesByTag);

export default router;
