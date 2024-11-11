import { Router } from "express";
import { createFolderController } from "./folder.controller";

const folderRouter = Router();

folderRouter.post("/folder/create", createFolderController);

export default folderRouter;
