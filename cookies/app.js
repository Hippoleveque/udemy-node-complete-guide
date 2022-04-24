import path from "path";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import MongoSession from "connect-mongodb-session";
import csrf from "csurf";
const MongoDBStore = MongoSession(session);

import User from "./models/user.js";

import { get404 } from "./controllers/error.js";

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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

main();
