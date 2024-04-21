import mongoose, { Schema } from "mongoose";
import { IEmployee } from "../types/employee.type";

const employeeSchema = new Schema<IEmployee>(
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

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
