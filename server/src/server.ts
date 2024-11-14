import express from "express";
import authRouter from "./api/v1/registration/registration.route";
const env = require("dotenv").config();
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";
import fileRouter from "./api/v1/file/file.route";
import folderRouter from "./api/v1/folder/folder.route";
import fileSystemRouter from "./api/v1/filesystem/filesystem.router";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", authMiddleware, (req, res) => {
  console.log(`the req user is`, req.user);
  res.send(
    `Hello Worlds how r u today its election day: DB Connection: ${process.env.DATABASE_URL}`
  );
});

// Use the webhook routes
app.use("/api/v1", authRouter);
app.use("/api/v1", fileRouter);
app.use("/api/v1", folderRouter);
app.use("/api/v1", fileSystemRouter);

app.listen(3000, "0.0.0.0", function () {
  console.log("Listening on port: 3000");
});
