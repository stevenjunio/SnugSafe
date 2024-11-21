import { Router } from "express";
import {
  createFileController,
  deleteFileController,
  getFileController,
  getFilesController,
  postShareRequestController, // Import the new controller
} from "./file.controller";

const fileRouter = Router();

fileRouter.get("/file/upload", createFileController);
fileRouter.post("/file/upload", createFileController);
fileRouter.get("/file/:id", getFileController);
fileRouter.get("/files", getFilesController);
fileRouter.delete("/file/:id", deleteFileController);
fileRouter.post("/file/share", postShareRequestController); // Add new route

export default fileRouter;
