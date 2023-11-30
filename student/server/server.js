import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import { promisify } from "util";
import { readFile as _readFile } from "fs";
import cors from "cors";
import authRouter from "./routes/auth.js";
import studentRouter from "./routes/student.js";
import examRouter from "./routes/exam.js";
import ameldeListeRouter from "./routes/anmeldeList.js";
import notenspiegelRouter from "./routes/notenspiegel.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(fileUpload());

connectDB();
// Handling Uncaught Exception
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/exam", examRouter);
app.use("/api/anmeldeliste", ameldeListeRouter);
app.use("/api/notenspiegel", notenspiegelRouter);

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
