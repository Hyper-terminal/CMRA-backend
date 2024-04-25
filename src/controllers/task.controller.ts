import { Response } from "express";
import ResponseHandler from "../libs";
import { IRequest } from "../middlewares";
import Task from "../models/task.model";

export const createTask = async (req: IRequest, res: Response) => {
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

export const getAllTasks = async (req: IRequest, res: Response) => {
  try {
    const results = await Task.find();
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};
