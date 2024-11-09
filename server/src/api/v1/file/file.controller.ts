import { Request, Response } from "express";

// Create a controller for the file upload route
export const createFileController = async (req: Request, res: Response) => {
  // Log headers
  console.log("Headers:", req.headers);

  // Log body
  console.log("Body:", req.body);
};
