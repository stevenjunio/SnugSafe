"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filesystem_controller_1 = require("./filesystem.controller");
const fileSystemRouter = (0, express_1.Router)();
fileSystemRouter.get("/filesystem", filesystem_controller_1.getFileSystemController);
exports.default = fileSystemRouter;
