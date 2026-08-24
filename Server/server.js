import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";


dotenv.config();
import "dotenv/config";

console.log("AWS_BUCKET:", process.env.AWS_S3_BUCKET_NAME);
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID?.length
    
);
console.log(
  "AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY?.length
   
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();