import mongoose, { Schema } from "mongoose";
import { IWorker } from "../types/worker.type";

const workerSchema = new Schema<IWorker>({
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
  employeeId: {
    type: String,
    unique: true, // Ensure employeeId is unique
    index: true, // Add an index for faster lookup
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  familyDetails: {
    father: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
    mother: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
    spouse: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
  },
});

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
