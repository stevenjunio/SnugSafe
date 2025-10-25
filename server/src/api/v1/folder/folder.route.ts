import { Router } from "express";
import {
  createFolderController,
  deleteFolderController,
  getFoldersController,
  getFolderController,
  getFolderBreadcrumbsController,
  updateFolderController,
} from "./folder.controller";

const folderRouter = Router();

folderRouter.post("/folder/create", createFolderController);
folderRouter.get("/folders", getFoldersController);
folderRouter.get("/folder/:id", getFolderController);
folderRouter.get("/folder/:id/breadcrumbs", getFolderBreadcrumbsController);
folderRouter.put("/folder/:id", updateFolderController);
folderRouter.delete("/folder/:id", deleteFolderController);

export default folderRouter;
