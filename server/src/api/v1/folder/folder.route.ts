import { Router } from "express";
import {
  createFolderController,
  deleteFolderController,
} from "./folder.controller";

const folderRouter = Router();

folderRouter.post("/folder/create", createFolderController);
folderRouter.delete("/folder/:id", deleteFolderController);

export default folderRouter;
