import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide a email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide an valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
    // maxlength: 50,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //restricts password tampering when save() is called but password not changed while updating
  const salt = 10;
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
