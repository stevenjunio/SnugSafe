import { Router } from "express";
import {
  createFileController,
  deleteFileController,
  deleteFileShareController,
  getFileController,
  getFilesController,
  getSharedFileController,
  getSharedFilesController,
  postShareRequestController,
  bulkDeleteFilesController,
  bulkMoveFilesController,
  bulkTagFilesController,
  updateFileController,
} from "./file.controller";

const fileRouter = Router();

fileRouter.get("/file/upload", createFileController);
fileRouter.post("/file/upload", createFileController);
fileRouter.get("/file/share", getSharedFilesController);
fileRouter.get("/file/:id", getFileController);
fileRouter.put("/file/:id", updateFileController);
fileRouter.get("/files", getFilesController);
fileRouter.delete("/file/:id", deleteFileController);
fileRouter.post("/file/share", postShareRequestController);
fileRouter.get("/file/share/:id", getSharedFileController);
fileRouter.delete("/file/share/:id", deleteFileShareController);

// Bulk operations
fileRouter.post("/files/bulk/delete", bulkDeleteFilesController);
fileRouter.post("/files/bulk/move", bulkMoveFilesController);
fileRouter.post("/files/bulk/tag", bulkTagFilesController);

export default fileRouter;
