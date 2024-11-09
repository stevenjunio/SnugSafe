import { Router } from "express";
import { createUserController } from "./registration.controller";

const authRouter = Router();

authRouter.post("/auth/register", createUserController);
authRouter.get("/auth/register", createUserController);

export default authRouter;
