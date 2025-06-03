import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:4566", // Se Next.js em container, usar "http://localstack:4566"
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "meu-bucket";

export async function uploadFile({ name, type, buffer }: { name: string; type: string; buffer: Buffer }) {
  const key = `uploads/${Date.now()}-${name.replace(/\s+/g, '-')}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: type,
  });

  await s3Client.send(command);
  return key;
}

export async function listFiles() {
  const command = new ListObjectsCommand({
    Bucket: BUCKET_NAME,
    Prefix: "uploads/",
  });

  const { Contents } = await s3Client.send(command);
  return Contents?.map(item => item.Key || "") || [];
}

export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
