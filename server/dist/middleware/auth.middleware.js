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
exports.authMiddleware = void 0;
const node_sdk_1 = require("@corbado/node-sdk");
const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
const frontendAPI = process.env.CORBADO_FRONTEND_API;
const backendAPI = process.env.CORBADO_BACKEND_API;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sessionToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.cbo_session_token;
    if (!sessionToken) {
        console.error(`User tried to authenticate endpoint with no session token`);
        res.status(401).json({ error: "You are not authenticated" });
        return;
    }
    if (projectID && apiSecret && frontendAPI && backendAPI) {
        const config = new node_sdk_1.Config(projectID, apiSecret, frontendAPI, backendAPI);
        const sdk = new node_sdk_1.SDK(config);
        const user = yield sdk.sessions().validateToken(sessionToken);
        console.log(`the user is`, user);
        req.user = user;
        next();
    }
});
exports.authMiddleware = authMiddleware;
