import { Document, Types } from "mongoose";

export interface ITask extends Document {
  taskId: string;
  status: "Pending" | "Completed" | "Not Assigned" | "Assigned";
  assignedWorkers: Types.ObjectId[];
  assignedServiceManager: Types.ObjectId[];
  service: Types.ObjectId;
  areaOfService: number;
  amount: number;
  dateOfService: Date;
  dateOfCompletion: Date;
  clientPhone: number;
  address: string;
  additionalInfo: string;
  clientName: string;
}
