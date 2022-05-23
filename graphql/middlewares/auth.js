import jwt from "jsonwebtoken";
import "dotenv/config";

export const checkAuth = (req, res, next) => {
  const headers = req.get("Authorization");
  if (!headers) {
    req.isAuthenticated = false;
    return next();
  }
  try {
    const token = headers.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      req.isAuthenticated = false;
      return next();
    }
    req.userId = decodedToken.userId;
  } catch (err) {
    req.isAuthenticated = false;
    return next();
  }
  req.isAuthenticated = true;
  next();
};
