import jwt from "jsonwebtoken";
import "dotenv/config.js";

const generateAccessToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRED_IN,
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

const parseJWT = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseJWT,
};
