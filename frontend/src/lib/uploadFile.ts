import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function uploadFile(file: File) {
  const s3Client = new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_S3_ENDPOINT,
    credentials: {
      accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
    },
  });

  const upload = await s3Client.send(
    new PutObjectCommand({
      Bucket: "snugsafe-user-files",
      Key: file.name,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    })
  );
  if (upload.$metadata.httpStatusCode === 200) {
    console.log(`Successfully uploaded ${file.name} to S3`);
  }

  //   const command = new GetObjectCommand({
  //     Bucket: "snugsafe-user-files",
  //     Key: file.name,
  //   });

  //   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 10 }); // URL expires in 1 hour
  //   console.log(`The signed URL is`, signedUrl);
  //   return signedUrl;
}
