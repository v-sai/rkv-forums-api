import jwt from "jsonwebtoken";

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT(user);
  res.cookie("accessToken", token, {
    maxAge: 60000 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
