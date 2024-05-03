import mongoose, { Model, Schema } from "mongoose";
import { ITask } from "../types/task.type";

// Define the task schema
const taskSchema = new Schema<ITask>(
  {
    taskId: {
      type: String,
      unique: true,
    },
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
      required: false,
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
      enum: ["Pending", "Completed", "Not Assigned", "Assigned"],
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
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

taskSchema.pre<ITask>("save", async function (next) {
  const constructorMethod = this.constructor as Model<ITask>;
  if (!this.isNew) {
    return next();
  }

  try {
    const lastTask = await constructorMethod.findOne(
      {},
      {},
      { sort: { taskId: -1 } }
    );

    if (lastTask) {
      const newIncrementalId = parseInt(lastTask.taskId) + 1;
      this.taskId = newIncrementalId.toString().padStart(4, "0");
    } else {
      this.taskId = "0001";
    }

    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Create and export the task model
const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
