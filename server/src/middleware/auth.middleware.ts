import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { userId: string; fullName: string };
  }
}

import { SDK, Config } from "@corbado/node-sdk";

const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
const frontendAPI = process.env.CORBADO_FRONTEND_API;
const backendAPI = process.env.CORBADO_BACKEND_API;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.cookies?.cbo_session_token;
  if (!sessionToken) {
    console.error(`User tried to authenticate endpoint with no session token`);
    res.status(401).json({ error: "You are not authenticated" });
    return;
  }

  if (projectID && apiSecret && frontendAPI && backendAPI) {
    const config = new Config(projectID, apiSecret, frontendAPI, backendAPI);

    const sdk = new SDK(config);
    const user = await sdk.sessions().validateToken(sessionToken);

    console.log(`the user is`, user);
    req.user = user;
    next();
  }
};
