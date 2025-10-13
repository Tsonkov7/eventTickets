import mongoose from "mongoose";
import { DATABASE_MODELS, DATABASE_COLLECTIONS } from "../../constants.js";
import AuthService from "../../services/auth.service.js";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    minlength: [5, "User email must be at least 5 characters"],
    maxlength: [254, "User email cannot exceed 254 characters"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await AuthService.hashPassword(this.password);
  next();
});

const User = mongoose.model(DATABASE_MODELS.USER, userSchema);
export default User;
