import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.type";

// Define the user schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "manager",
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
    unique: true,
  },
});

// Create and export the user model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
