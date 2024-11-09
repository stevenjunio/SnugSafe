import { Request, Response } from "express";
import { createUser } from "./registration.service";

export const createUserController = async (req: Request, res: Response) => {
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
    const newUser = await createUser({ authID, username });
    res.json({ newUser }).status(200).send();
  } catch (e: any) {
    console.log(e);
    if (e.code === "P2002") {
      res.status(400).send("User already exists");
    }
  }
};
