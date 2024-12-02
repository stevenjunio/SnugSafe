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
exports.deleteFolderController = exports.createFolderController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a controller for the file upload route
const createFolderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Log headers
    console.log("Headers:", req.headers);
    const name = req.body.name;
    const user = req.body.user;
    const key = req.body.key;
    // Log body
    console.log("Body:", req.body);
    try {
        const newFolder = yield prisma.userFolder.create({
            data: {
                name: name,
                user: {
                    connect: {
                        authId: user,
                    },
                },
            },
        });
        res.status(200).json(newFolder); // Send the response with status 200 and the new file data
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating file" }); // Send the error response with status 500
    }
});
exports.createFolderController = createFolderController;
const deleteFolderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(422);
    }
    console.log(`the id we're trying to delete is`, id);
    const data = yield prisma.userFolder.delete({
        where: {
            id: id,
        },
    });
    res.status(200).json(data);
});
exports.deleteFolderController = deleteFolderController;
