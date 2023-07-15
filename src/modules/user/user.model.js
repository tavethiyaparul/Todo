import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      message: "Name validation failed",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
      message: "Email validation failed",
      trim: true,
    },
    password: {
      type: String,
      required: true,
      message: "Password validation failed",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPAIR,
  });
};

userSchema.methods.comparePassword = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

export default mongoose.model("User", userSchema);
