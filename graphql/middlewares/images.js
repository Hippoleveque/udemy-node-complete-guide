import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createImage = async (req, res, next) => {
  const oldImagePath = req.body.imagePath;
  if (!req.isAuthenticated) {
    const err = new Error("Not Authenticated");
    err.statusCode = 401;
    throw err;
  }
  try {
    if (!req.file) {
     return res.status(200).json({ message: "No file provided.", imagePath: oldImagePath });
    }
    const imagePath = req.file.path;
    if (oldImagePath && imagePath !== oldImagePath) {
      clearImage(oldImagePath);
    }
    return res.status(201).json({ message: "Image created", imagePath });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const clearImage = (imageUrl) => {
  const imagePath = path.join(__dirname, "..", imageUrl);
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
};
