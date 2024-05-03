import { Request, Response } from "express";
import ResponseHandler from "../libs";
import Task from "../models/task.model";

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      assignedWorkers,
      assignedServiceManager,
      service,
      areaOfService,
      amount,
      dateOfService,
      dateOfCompletion,
      clientPhone,
      address,
      additionalInfo,
      clientName,
    } = req.body;

    const newTask = new Task({
      assignedWorkers,
      assignedServiceManager,
      service,
      areaOfService,
      amount,
      dateOfService,
      dateOfCompletion,
      clientPhone,
      address,
      additionalInfo,
      clientName,
    });

    await newTask.save();

    return ResponseHandler.created(res, "Task created successfully", newTask);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const results = await Task.find();
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};

export const startTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return ResponseHandler.error(res, 404, "Task not found");
    }

    // Update the task with the hashed OTP
    task.status = "Started";
    await task.save();

    // Send the OTP to the client (implementation depends on your setup)
    // sendOtpToClient(task.clientPhone, otp);

    return ResponseHandler.success(
      res,
      "Task started successfully, OTP sent to client",
      { taskId: task._id, status: task.status }
    );
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};
