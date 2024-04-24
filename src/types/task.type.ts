import { Document, Types } from "mongoose";

export interface ITask extends Document {
  status: "Pending" | "Completed" | "Not Assigned";
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
