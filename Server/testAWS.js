import "dotenv/config";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: "test/direct-test.txt",
  Body: "Direct S3 upload test",
  ContentType: "text/plain",
});

try {
  const result = await s3.send(command);

  console.log("========== DIRECT S3 UPLOAD ==========");
  console.log("SUCCESS ✅");
  console.log(result);
} catch (error) {
  console.error("DIRECT S3 ERROR ❌");
  console.error(error);
}