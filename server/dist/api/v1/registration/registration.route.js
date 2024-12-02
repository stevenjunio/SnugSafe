"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("./registration.controller");
const authRouter = (0, express_1.Router)();
authRouter.post("/auth/register", registration_controller_1.createUserController);
authRouter.get("/auth/register", registration_controller_1.createUserController);
exports.default = authRouter;
