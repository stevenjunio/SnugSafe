import { Router } from "express";
import {
  createFileController,
  deleteFileController,
  getFileController,
  getFilesController,
} from "./file.controller";

const fileRouter = Router();

fileRouter.get("/file/upload", createFileController);
fileRouter.post("/file/upload", createFileController);
fileRouter.get("/file/:id", getFileController);
fileRouter.get("/files", getFilesController);
fileRouter.delete("/file/:id", deleteFileController);

export default fileRouter;
