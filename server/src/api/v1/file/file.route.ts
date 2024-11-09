import { Router } from "express";

const fileRouter = Router();

fileRouter.get("/file/upload", (req, res) => {
  res.status(200).send("File uploaded successfully");
});

export default fileRouter;
