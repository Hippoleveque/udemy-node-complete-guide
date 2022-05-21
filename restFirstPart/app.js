import express from "express";
import path from "path";
import bodyParser from "body-parser";
import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import multer from "multer";
import { Server } from "socket.io";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    req.badImageType = true;
    cb(null, false);
  }
};

const app = express();

app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message });
});

const mongoUrl = "mongodb://localhost:27017/blog";

const main = async () => {
  try {
    await mongoose.connect(mongoUrl);
    const server = app.listen(8080);
    const io = new Server(server, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  } catch (err) {
    console.log(err);
  }
};

main();
