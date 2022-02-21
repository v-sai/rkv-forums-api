import dotenv from "dotenv";
dotenv.config();
import expressAsyncErrors from "express-async-errors";

import express from "express";
const app = express();

import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectToDb from "./db/connect.js";
import notFound from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

//middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => res.status(200).json("E-commerce-api"));
//test route
app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.status(200).json("E-commerce-api");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToDb(process.env.MONGO_URL);
    app.listen(PORT, console.log(`api server started at port  ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
