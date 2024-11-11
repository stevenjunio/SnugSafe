import { S3Client } from "@aws-sdk/client-s3";

export const createS3Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_S3_ENDPOINT,
    credentials: {
      accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
    },
  });
};
