"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileSystemController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getFileSystemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = req.headers;
    const { user, folder } = req.query;
    console.log(`the req`, req.params);
    console.log(`the user from query`, user);
    if (!user) {
        res.status(400).json({ error: "User is required" });
        return;
    }
    console.log(`Getting file system for user ${user} and folder ${folder}`);
    const files = yield prisma.userFile.findMany({
        where: {
            user: {
                authId: user,
            },
        },
        select: {
            id: true,
            name: true,
            size: true,
            type: true,
        },
    });
    const folders = yield prisma.userFolder.findMany({
        select: {
            id: true,
            name: true,
            parentFolderId: true,
        },
        where: {
            user: {
                authId: user,
            },
        },
    });
    console.log(` we found files`, files, folders);
    //join the files and folders with an array
    const fileSystem = [
        ...files.map((file) => (Object.assign(Object.assign({}, file), { itemType: "file" }))),
        ...folders.map((folder) => (Object.assign(Object.assign({}, folder), { itemType: "folder" }))),
    ];
    res.status(200).json(fileSystem); // Send the response with status 200 and the new file data
});
exports.getFileSystemController = getFileSystemController;
