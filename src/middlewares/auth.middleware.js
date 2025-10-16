import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "No access token found!!" });
  }

  try {
    // Bearer token ko extract karo
    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;

    const payload = jsonwebtoken.verify(token, ACCESS_SECRET);
    console.log("✅ User ID from token:", payload.sub);

    // userId ko string me ensure karo
    req.userId = payload.sub?.toString();
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "jwt expired" });
    }

    return res.status(403).json({ message: "Invalid token" });
  }
};
