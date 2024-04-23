import mongoose, { Model, Schema } from "mongoose";
import { IEmployee } from "../types/employee.type";

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      unique: true,
    },

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

// Define pre-save middleware to auto-increment employeeId
employeeSchema.pre<IEmployee>("save", async function (next) {
  const companyName = "IN";
  const constructorMethod = this.constructor as Model<IEmployee>;
  if (!this.isNew) {
    // If document is not new, do nothing
    return next();
  }

  try {
    const lastWorker = await constructorMethod.findOne(
      {},
      {},
      { sort: { employeeId: -1 } }
    );

    if (lastWorker) {
      // If there are existing workers, increment the employeeId
      const newIncrementalId =
        parseInt(lastWorker.employeeId.split(companyName)[1]) + 1;
      this.employeeId = companyName + newIncrementalId;
    } else {
      // If no workers exist, start from 1
      this.employeeId = companyName + 1;
    }

    return next();
  } catch (error: any) {
    return next(error);
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
