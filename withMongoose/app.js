import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import { get404 } from "./controllers/error.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

app.use(bodyParser.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById('5baa2528563f16379fc8a610')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

const mongoUrl = "mongodb://localhost:27017/shopMongoose";

const main = async () => {
  try {
    await mongoose.connect(mongoUrl);
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

main();
