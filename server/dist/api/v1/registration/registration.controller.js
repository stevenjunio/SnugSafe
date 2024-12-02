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
exports.createUserController = void 0;
const registration_service_1 = require("./registration.service");
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Log headers
    console.log("Headers:", req.headers);
    // Log body
    console.log("Body:", req.body);
    const { authID, username } = req.body;
    console.log(`the authID and username are: `, authID, username);
    // Log query parameters
    console.log("Query Params:", req.query);
    if (!authID && !username) {
        res.status(400).send("Missing required fields, authID and username");
    }
    try {
        const newUser = yield (0, registration_service_1.createUser)({ authID, username });
        res.json({ newUser }).status(200).send();
    }
    catch (e) {
        console.log(e);
        if (e.code === "P2002") {
            res.status(400).send("User already exists");
        }
    }
});
exports.createUserController = createUserController;
