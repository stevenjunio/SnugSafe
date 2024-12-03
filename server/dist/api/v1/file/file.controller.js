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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedFileController = exports.getSharedFilesController = exports.postShareRequestController = exports.deleteFileController = exports.getFilesController = exports.getFileController = exports.createFileController = void 0;
const client_1 = require("@prisma/client");
const client_s3_1 = require("@aws-sdk/client-s3");
const file_service_1 = require("./file.service");
const getUserByUsername_1 = __importDefault(require("../../../utils/getUserByUsername"));
const corbado_1 = require("../../../utils/corbado");
const prisma = new client_1.PrismaClient();
const s3Client = new client_s3_1.S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});
// Create a controller for the file upload route
const createFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Log headers
    console.log("Headers:", req.headers);
    const name = req.body.name;
    const type = req.body.type;
    const user = req.body.user;
    const key = req.body.key;
    // Log body
    console.log("Body:", req.body);
    try {
        const newFile = yield prisma.userFile.create({
            data: {
                type: type,
                id: key,
                name: name,
                size: req.body.size,
                user: {
                    connect: {
                        authId: user,
                    },
                },
            },
        });
        res.status(200).json(newFile); // Send the response with status 200 and the new file data
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating file" }); // Send the error response with status 500
    }
});
exports.createFileController = createFileController;
const getFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(`Getting file with id ${id}`);
    try {
        const file = yield prisma.userFile.findUnique({
            where: {
                id: id,
            },
        });
        res.status(200).json(file);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error getting file" });
    }
});
exports.getFileController = getFileController;
const getFilesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.query.user;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10
    const page = parseInt(req.query.page) || 1; // Default page to 1
    const skip = (page - 1) * limit;
    console.log(`Getting files for user ${user}`);
    try {
        const files = yield prisma.userFile.findMany({
            where: {
                user: {
                    authId: user,
                },
            },
            take: limit,
            skip: skip,
        });
        res.status(200).json(files);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error getting files" });
    }
});
exports.getFilesController = getFilesController;
const deleteFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(`Deleting file with id ${id}`);
    try {
        const file = yield prisma.userFile.delete({
            where: {
                id: id,
            },
        });
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.id,
        });
        console.log(`Deleting file from S3 with key ${file.id}`);
        const deleteResponse = yield s3Client.send(deleteCommand);
        console.log(`S3 response:`, deleteResponse);
        res.status(200).json(file);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error deleting file" });
    }
});
exports.deleteFileController = deleteFileController;
const postShareRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, username } = req.body;
    if (!fileId || !username) {
        res.status(400).json({ error: "Missing fileId or username" });
        return;
    }
    try {
        console.log(`Sharing file ${fileId} with ${username} and access levelsss`);
        const fileAccessManager = new file_service_1.FileAccessManager();
        //generate a key from the fileAccessManager
        const key = yield fileAccessManager.generateKeyFromBubbleLamp();
        console.log(`the fileKey from the BubbleLamp key is:`, key);
        const user = yield (0, getUserByUsername_1.default)(username);
        //save the key to the user in the db
        const fileKey = yield prisma.userFileKey.create({
            data: {
                key: key,
                userFile: {
                    connect: {
                        id: fileId,
                    },
                },
                user: {
                    connect: {
                        authId: user,
                    },
                },
            },
        });
        if (!fileKey) {
            res.status(400).json({ error: "Error saving key" });
            return;
        }
        // Share the file with the user
        const newFileShare = yield fileAccessManager.shareFileWithUser(username, fileId);
        console.log(`the new fileshare is:`, newFileShare);
        //@ts-ignore because for some reason types aren't working
        if (newFileShare === null || newFileShare === void 0 ? void 0 : newFileShare.error) {
            res.status(400).json({ error: newFileShare });
            return;
        }
        res.status(200).json({ fileShare: newFileShare });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error sharing file" });
    }
});
exports.postShareRequestController = postShareRequestController;
const getSharedFilesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.query;
    console.log(`Getting shared files for user ${userID}`);
    if (!userID || typeof userID !== "string") {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const sharedFiles = yield prisma.fileShare.findMany({
            where: {
                sharedTo: { authId: userID },
            },
            include: {
                userFile: {
                    select: {
                        user: {
                            select: {
                                userName: true,
                            },
                        },
                        name: true,
                        id: true,
                        type: true,
                    },
                },
            },
        });
        console.log(`Shared files:`, sharedFiles);
        // add in the username
        res.status(200).json(sharedFiles);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error getting shared files" });
    }
});
exports.getSharedFilesController = getSharedFilesController;
const getSharedFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const headers = req.headers;
    const authHeader = headers.authorization;
    console.log(`Getting shared file with id ${id}`);
    console.log(`the cookies are:`, req.cookies);
    console.log(`the headers are:`, headers);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        // Get the user from Corbado
        const user = yield corbado_1.corbadoSDK
            .sessions()
            .validateToken(authHeader.split("Bearer ")[1]);
        if (!user) {
            console.error("Unauthorized: User not found");
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Check if the user has access to the file via the keys in the DB
        const sharedFile = yield prisma.fileShare.findUnique({
            where: {
                id: id,
            },
            include: {
                userFile: {
                    select: {
                        user: {
                            select: {
                                userName: true,
                                authId: true,
                            },
                        },
                        name: true,
                        id: true,
                        type: true,
                    },
                },
            },
        });
        if (!sharedFile) {
            console.error("File not found");
            res.status(404).json({ error: "File not found" });
            return;
        }
        const fileAccessKey = yield prisma.userFileKey.findFirst({
            where: {
                userFile: {
                    id: sharedFile.userFile.id,
                },
                user: {
                    authId: user.userId,
                },
            },
        });
        if (fileAccessKey) {
            res.status(200).json(sharedFile);
        }
        else {
            console.error("Unauthorized: No valid file access key");
            res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (err) {
        console.error("Error getting shared file:", err);
        res.status(500).json({ error: "Error getting shared file" });
    }
});
exports.getSharedFileController = getSharedFileController;
