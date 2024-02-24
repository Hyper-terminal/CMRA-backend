import mongoose, { Document, Schema } from "mongoose";

// Define the user interface
interface IUser extends Document {
  name: string;
  email: string;
  role: "manager" | "employee";
}

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
    default: "employee",
  },
});

// Create and export the user model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
