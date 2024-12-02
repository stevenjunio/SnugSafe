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
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ authID, username }) {
    //take in the users initial data here
    //check if they already exist
    const userExists = yield prisma.user.findUnique({
        where: {
            authId: authID,
            userName: username,
        },
    });
    if (userExists) {
        return userExists;
    }
    //create the user in the database
    const user = yield prisma.user.create({
        data: {
            authId: authID,
        },
    });
    //return new users data
    return user;
});
exports.createUser = createUser;
