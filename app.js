import express from "express";
import userRouter from "./routers/userRoute.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import { config } from "dotenv";
import helmet from "helmet";

import cloudinary from "cloudinary";
import connectDatabase from "./config/database.js";

const app = express();
config({
  path: "./config/config.env",
});

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use("/api/v1", userRouter);
// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     useTempFiles: true,
//   })
// );

app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
await connectDatabase();
app.listen(port, () => {
  console.log("Server running on port " + port);
});
