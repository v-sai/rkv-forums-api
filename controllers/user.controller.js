import User from "../models/User.js";
import * as CustomError from "../errors/index.js";
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} from "../utils/index.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("_id name email role");
  res.status(200).json(users);
};

export const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new CustomError.NotFoundError(
      `No item found with id : ${req.params.id}`
    );
  }
  checkPermission(req.user, user);
  res.status(200).json(user);
};

export const showCurrentUser = async (req, res) => {
  if (!req.user) {
    throw new CustomError.UnauthenticatedError("Not Authenticated");
  }
  // const user = await User.findOne({ _id: req.user.userId }).select(
  //   "name email -_id"
  // );
  res.status(200).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ user: tokenUser });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Provide old and new passwords");
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isValidPassword = await user.comparePassword(oldPassword);
  if (!isValidPassword) {
    throw new CustomError.UnauthenticatedError("password not matched");
  }
  user.password = newPassword;
  await user.save();

  res.status(200).json({ msg: "Success password updated" });
};
