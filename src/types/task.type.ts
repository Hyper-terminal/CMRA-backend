import { Document, Types } from "mongoose";

export interface ITask extends Document {
  description: string;
  status: "Pending" | "Completed" | "Not Assigned";
  assignedWorkers: Types.ObjectId[];
  assignedServiceManager: Types.ObjectId[];
  service: Types.ObjectId;
}
