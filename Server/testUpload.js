import "dotenv/config";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.AWS_S3_BUCKET_NAME;

try {
  const result = await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: "test/test.txt",
      Body: "AWS S3 test successful!",
      ContentType: "text/plain",
    })
  );

  console.log("========== S3 UPLOAD ==========");
  console.log("Upload successful ✅");
  console.log("Bucket:", bucket);
  console.log("Key:", "test/test.txt");
  console.log("ETag:", result.ETag);
} catch (error) {
  console.log("========== S3 UPLOAD ==========");
  console.log("Upload failed ❌");
  console.log("Name:", error.name);
  console.log("Message:", error.message);
  console.log("HTTP:", error.$metadata?.httpStatusCode);
  console.log("Request ID:", error.$metadata?.requestId);
  console.log("Full error:", error);
}