import * as CustomError from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

export const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.accessToken;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Not Authenticated");
  }
  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Not Authenticated");
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.notAuthorized("Not Authorized");
    }
    next();
  };
};
