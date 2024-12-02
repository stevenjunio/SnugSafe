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
exports.FileAccessManager = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const sharp_1 = __importDefault(require("sharp"));
const getUserByUsername_1 = __importDefault(require("../../../utils/getUserByUsername"));
require("dotenv").config();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
class FileAccessManager {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    generateKeyFromBubbleLamp() {
        return __awaiter(this, void 0, void 0, function* () {
            const image = (0, sharp_1.default)("src/public/images/cute-lamp-auth.webp");
            const { data, info } = yield image
                .raw()
                .toBuffer({ resolveWithObject: true });
            console.log(data, data.length, info);
            // Add your image processing logic here
            // Select random pixels and generate a key
            const selectedPixels = [];
            for (let i = 0; i < 32; i++) {
                const randomPos = (0, crypto_1.randomInt)(0, data.length / 3) * 3;
                selectedPixels.push(data[randomPos], data[randomPos + 1], data[randomPos + 2]);
            }
            console.log(`the randomly selected pixels are: `, selectedPixels);
            const fileKey = (0, crypto_1.createHash)("sha256")
                .update(Buffer.from(selectedPixels))
                .digest("hex");
            console.log(`the final hash`, fileKey);
            if (!process.env.BUBBLE_LAMP_PRIVATE_KEY) {
                throw new Error(`No bubble lamp public key found`);
            }
            return fileKey;
        });
    }
    verifyUserAccess(userPublicKey, signature) {
        if (!process.env.BUBBLE_LAMP_PRIVATE_KEY) {
            throw new Error(`No private key found`);
        }
        if (!userPublicKey) {
            throw new Error(`No user public key found`);
        }
        if (!signature) {
            throw new Error(`No signature found`);
        }
        try {
            console.log(`trying to verify with the following:`, {
                userPublicKey,
                privateKey: process.env.BUBBLE_LAMP_PRIVATE_KEY,
                signature,
            });
            return (0, crypto_1.verify)("SHA256", Buffer.from(userPublicKey), process.env.BUBBLE_LAMP_PRIVATE_KEY, signature);
        }
        catch (error) {
            return false;
        }
    }
    shareFileWithUser(username, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`the username we are sharing to is: `, username);
            const userAuthID = yield (0, getUserByUsername_1.default)(username);
            if (!userAuthID) {
                console.error(`No user was found`);
                return { error: "No user was found" };
            }
            console.log(`the user associated with the ID that we are sharing to is: `, userAuthID);
            if (userAuthID) {
                const user = yield this.prisma.user.findUnique({
                    where: { authId: userAuthID },
                });
                if (user) {
                    const newFileShare = yield this.prisma.fileShare.create({
                        data: {
                            userFileID: file,
                            userSharedToID: user.id,
                        },
                    });
                    console.log(`We created a new FileShare:`, newFileShare);
                    return newFileShare;
                }
            }
        });
    }
}
exports.FileAccessManager = FileAccessManager;
