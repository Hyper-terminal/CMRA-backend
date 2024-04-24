import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.type";

// Define the task schema
const taskSchema = new Schema<ITask>(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    dateOfService: {
      type: Date,
      required: true,
    },
    dateOfCompletion: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    areaOfService: {
      type: Number,
      required: true,
    },

    additionalInfo: {
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
        ref: "Employee",
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
