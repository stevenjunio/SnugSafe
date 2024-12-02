"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const folder_controller_1 = require("./folder.controller");
const folderRouter = (0, express_1.Router)();
folderRouter.post("/folder/create", folder_controller_1.createFolderController);
folderRouter.delete("/folder/:id", folder_controller_1.deleteFolderController);
exports.default = folderRouter;
