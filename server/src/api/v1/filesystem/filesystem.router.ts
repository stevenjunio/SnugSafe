import { Router } from "express";
import { getFileSystemController } from "./filesystem.controller";

const fileSystemRouter = Router();

fileSystemRouter.get("/filesystem/get", getFileSystemController);

export default fileSystemRouter;
