import path from "path";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import MongoSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import multer from "multer";

const MongoDBStore = MongoSession(session);
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    req.badImageType = true;
    cb(null, false);
  }
}

import User from "./models/user.js";

import { get404, get500 } from "./controllers/error.js";

const MONGO_URL = "mongodb://localhost:27017/shopCookies";

const app = express();
let store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});
const csrfProctection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    store: store,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use(csrfProctection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/500", get500);

app.use(get404);

app.use((error, req, res, next) => {
  return res.redirect("/500");
});

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

main();
