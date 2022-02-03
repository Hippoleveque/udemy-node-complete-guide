const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./helpers/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000);
