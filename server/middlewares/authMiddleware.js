import jwt from "jsonwebtoken";
import User from "../db/models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!JWT_SECRET) {
        return res
          .status(500)
          .json({ message: "Server error: JWT secret not configured." });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password");

      if (req.user) {
      } else {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Not authorized, token expired" });
      } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Not authorized, invalid token" });
      } else {
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
