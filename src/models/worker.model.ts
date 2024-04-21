import mongoose, { Schema } from "mongoose";
import { IWorker } from "../types/worker.type";

const workerSchema = new Schema<IWorker>(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      email: {
        type: String,
        required: false,
      },
      phone: {
        type: Number,
        required: true,
        unique: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    documents: {
      aadharCard: {
        type: String,
      },
      drivingLicense: {
        type: String,
      },
      panCard: {
        type: String,
      },
    },
    salary: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    familyDetails: [
      {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
