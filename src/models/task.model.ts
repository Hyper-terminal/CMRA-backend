import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.type";

// Define the user schema
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
  },

  { timestamps: true }
);

// Create and export the user model
const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
