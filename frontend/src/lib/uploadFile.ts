import {
  // S3Client,
  PutObjectCommand,
  // GetObjectCommand,
} from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "./createS3Client";

export default async function uploadFile(
  file: File,
  folder = "/",
  userId: string
) {
  const s3Client = createS3Client();

  const upload = await s3Client.send(
    new PutObjectCommand({
      Bucket: "snugsafe-user-files",
      Key: userId + folder + file.name,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    })
  );
  if (upload.$metadata.httpStatusCode === 200) {
    console.log(`Successfully uploaded ${file.name} to S3`);

    const resData = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/file/upload`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          type: "file",
          user: userId,
          key: userId + folder + file.name,
          size: file.size,
        }),
      }
    );

    const savedFile = await resData.json();
    console.log(`Saved file to database`, savedFile);
    return savedFile;
  }

  //   const command = new GetObjectCommand({
  //     Bucket: "snugsafe-user-files",
  //     Key: file.name,
  //   });

  //   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 10 }); // URL expires in 1 hour
  //   console.log(`The signed URL is`, signedUrl);
  //   return signedUrl;
}
