import jwt from "jsonwebtoken";
import "dotenv/config";

export const isAuth = (req, res, next) => {
  const headers = req.get("Authorization");
  if (!headers) {
    const err = new Error("Not authenticated");
    err.statusCode = 401;
    throw err;
  }
  try {
    const token = headers.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const err = new Error("Not authenticated");
      err.statusCode = 401;
      throw err;
    }
    req.userId = decodedToken.userId;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  next();
};
