import express from "express";
const router = express.Router();
import {
  authenticateUser,
  authorizePermission,
} from "../middlewares/authentication.js";

import {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} from "../controllers/user.controller.js";

router.get("/", authenticateUser, authorizePermission("admin"), getAllUsers);
router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updatepassword", authenticateUser, updateUserPassword);

router.get("/:id", authenticateUser, getSingleUser);

export default router;
