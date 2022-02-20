import * as CustomError from "../errors/index.js";

const checkPermission = (loggedInUser, requestedUser) => {
  if (loggedInUser.userId === requestedUser._id.toString()) return;
  if (loggedInUser.role === "admin") return;
  throw new CustomError.notAuthorized("Not authorized to access this route");
};

export default checkPermission;
