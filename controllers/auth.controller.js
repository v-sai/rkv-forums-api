import User from "../models/User.js";
import * as CustomError from "../errors/index.js";
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";
import validator from "validator";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  //check duplicate emails
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const user = await User.create({ name, email, password });
  const userDetails = createTokenUser(user);
  //create jwt token and add cookies
  attachCookiesToResponse({ res, user: userDetails });
  res.status(200).json({ userDetails });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //check empty inputs
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please enter email and password");
  }

  // //check isValid mail
  // const isValidEmail = validator.isEmail(email);
  // if (!isValidEmail) {
  //   throw new CustomError.BadRequestError("Enter a valid email");
  // }

  //check user is present or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Enter correct credentials");
  }

  //check password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new CustomError.UnauthenticatedError("Enter correct credentials");
  }

  const userDetails = createTokenUser(user);
  //create jwt token and add cookies
  attachCookiesToResponse({ res, user: userDetails });
  res.status(200).json({ user: userDetails });
};

export const logout = async (req, res) => {
  res.cookie("accesToken", "logout", {
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json("logout");
};
