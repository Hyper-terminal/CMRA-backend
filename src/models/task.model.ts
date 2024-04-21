import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.type";

// Define the task schema
const taskSchema = new Schema<ITask>(
  {
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Not Assigned"],
      default: "Not Assigned",
    },
    assignedWorkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    assignedServiceManager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  { timestamps: true }
);

// Create and export the task model
const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
