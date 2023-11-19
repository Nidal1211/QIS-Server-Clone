import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import { promisify } from "util";
import { readFile as _readFile } from "fs";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(fileUpload());

cloudinary.config({
  cloud_name: "dkyyqvbna",
  api_key: "368228333932484",
  api_secret: "EaIv9OI8kTcHYA-ksztikEw7J54",
});

connectDB();
// Handling Uncaught Exception
app.use("/api", authRouter);
// server routes

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
server.on("UncaughtPromiseRejection", (err, req, res, next) => {
  res.status(500).send({
    success: false,
    message: " server closed due to UncaughtPromiseRejection ",
  });

  server.close(() => {
    exit(0);
  });
});
