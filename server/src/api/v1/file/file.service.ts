import { PrismaClient, user, userFile } from "@prisma/client";
import { createHash, randomInt } from "crypto";
import sharp from "sharp";

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

  async generateKeyFromBubbleLamp(fileId: userFile["id"], userId: user["id"]) {
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
    const hashedPixels = createHash("sha256")
      .update(Buffer.from(selectedPixels))
      .digest("hex");

    console.log(`the final hash`, hashedPixels);
    return hashedPixels;
  }

  //   async validateAccess(fileId, userId, providedKey) {
  //     // Recreate the compound key
  //     const validationKey = crypto
  //       .createHash("sha256")
  //       .update(`${fileId}:${userId}:${providedKey}`)
  //       .digest("hex");

  //     // Check if key exists in database
  //     const isValid = await this.verifyKeyInDatabase(validationKey);
  //     return isValid;
  //   }

  //   async getFileAccess(fileId, userId, providedKey) {
  //     const hasAccess = await this.validateAccess(fileId, userId, providedKey);

  //     if (!hasAccess) {
  //       throw new Error("Invalid access key");
  //     }

  //     // Generate temporary signed URL for R2
  //     const command = new GetObjectCommand({
  //       Bucket: "your-bucket-name",
  //       Key: fileId,
  //     });

  //     // Generate a signed URL that expires in 1 hour
  //     const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  //     return signedUrl;
  //   }
}

export { FileAccessManager };
