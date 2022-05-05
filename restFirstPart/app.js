import express from "express";
import bodyParser from "body-parser";
import feedRoutes from "./routes/feed.js";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());

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

const mongoUrl = "mongodb://localhost:27017/blog";

const main = async () => {
  try {
    await mongoose.connect(mongoUrl);
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
};

main();
