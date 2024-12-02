import { User } from "@corbado/node-sdk/cjs/services";
import { PrismaClient, user, userFile } from "@prisma/client";
import {
  createHash,
  randomInt,
  verify,
  sign,
  createSign,
  createPublicKey,
} from "crypto";
import sharp from "sharp";
import { SDK, Config } from "@corbado/node-sdk";
import { corbadoSDK } from "../../../utils/corbado";
import getUserByUsername from "../../../utils/getUserByUsername";
require("dotenv").config();

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

interface GenerateAccessKeyParams {
  fileId: string;
  userId: string;
}

class FileAccessManager {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateKeyFromBubbleLamp() {
    const image = sharp("src/public/images/cute-lamp-auth.webp");
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    console.log(data, data.length, info);
    // Add your image processing logic here

    // Select random pixels and generate a key
    const selectedPixels = [];
    for (let i = 0; i < 32; i++) {
      const randomPos = randomInt(0, data.length / 3) * 3;
      selectedPixels.push(
        data[randomPos],
        data[randomPos + 1],
        data[randomPos + 2]
      );
    }
    console.log(`the randomly selected pixels are: `, selectedPixels);
    const fileKey = createHash("sha256")
      .update(Buffer.from(selectedPixels))
      .digest("hex");

    console.log(`the final hash`, fileKey);

    return fileKey;
  }

  verifyUserAccess(userPublicKey: string, signature: Buffer) {
    //TO DO - implement db checks to verify the user's access key here
  }

  async shareFileWithUser(username: string, file: userFile["id"]) {
    console.log(`the username we are sharing to is: `, username);
    const userAuthID = await getUserByUsername(username);

    if (!userAuthID) {
      console.error(`No user was found`);
      return { error: "No user was found" };
    }
    console.log(
      `the user associated with the ID that we are sharing to is: `,
      userAuthID
    );
    if (userAuthID) {
      const user = await this.prisma.user.findUnique({
        where: { authId: userAuthID },
      });
      if (user) {
        const newFileShare = await this.prisma.fileShare.create({
          data: {
            userFileID: file,
            userSharedToID: user.id,
          },
        });
        console.log(`We created a new FileShare:`, newFileShare);
        return newFileShare;
      }
    }
  }
}

export { FileAccessManager };
