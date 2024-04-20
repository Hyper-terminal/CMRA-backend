import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "manager" | "employee";
  password: string;
  phone: number;
  timestamps: boolean;
}
