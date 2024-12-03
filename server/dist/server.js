"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registration_route_1 = __importDefault(require("./api/v1/registration/registration.route"));
const env = require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const file_route_1 = __importDefault(require("./api/v1/file/file.route"));
const folder_route_1 = __importDefault(require("./api/v1/folder/folder.route"));
const filesystem_router_1 = __importDefault(require("./api/v1/filesystem/filesystem.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.FRONTEND_URL, // Ensure this is the correct frontend URL
}));
app.use((0, cookie_parser_1.default)());
app.get("/", auth_middleware_1.authMiddleware, (req, res) => {
    console.log(`the req user is`, req.user);
    res.send(`Hello Worlds how r u today its election day: DB Connection: ${process.env.DATABASE_URL}`);
});
// Use the webhook routes
app.use("/api/v1", registration_route_1.default);
app.use("/api/v1", file_route_1.default);
app.use("/api/v1", folder_route_1.default);
app.use("/api/v1", filesystem_router_1.default);
app.listen(3000, "0.0.0.0", function () {
    console.log("Listening on port: 3000");
});
