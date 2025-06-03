import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = "comprovantes-pedidos";

export const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

export async function salvarComprovante(id: string, file: Buffer): Promise<string> {
  const Key = `comprovante-${id}.pdf`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key,
      Body: file,
      ContentType: "application/pdf",
    })
  );

  return `http://localhost:4566/${BUCKET_NAME}/${Key}`;
}
