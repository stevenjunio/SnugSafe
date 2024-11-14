import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createS3Client } from "./createS3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = createS3Client();
export default async function getFileURL(fileID: string) {
  console.log("Open S3 File");
  //open a new link

  const openCommand = new GetObjectCommand({
    Bucket: "snugsafe-user-files",
    Key: fileID,
  });

  const signedUrl = await getSignedUrl(s3, openCommand, { expiresIn: 1 }); // URL expires in 1 hour
  console.log(`The signed URL is`, signedUrl);
  return signedUrl;
}
