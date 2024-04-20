import { Response } from "express";
import { IRequest } from "../middlewares";
import Worker from "../models/worker.model";
import Task from "../models/task.model";
import ResponseHandler from "../libs";

export const createWorker = async (req: IRequest, res: Response) => {
  try {
    const {
      name,
      contact,
      tasks,
      documents,
      salary,
      dateOfBirth,
      familyDetails,
    } = req.body;

    // Create a new worker document
    const newWorker = new Worker({
      name,
      contact,
      tasks,
      documents,
      salary,
      dateOfBirth,
      familyDetails,
    });

    // Save the worker document to the database
    await newWorker.save();

    // Respond with the created worker document
    return ResponseHandler.created(
      res,
      "Worker created successfully",
      newWorker
    );
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with an error message
    return ResponseHandler.internalServerError(res, error);
  }
};

export const getAllWorkers = async (req: IRequest, res: Response) => {
  try {
    // extract query params
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [{ name: { $regex: new RegExp(search as string, "i") } }],
      };
    }
    // const skip: number = ((page as number) - 1) * (pageSize as number);

    const results = Worker.find(query).populate({
      path: "tasks",
      model: Task,
    });

    return ResponseHandler.success(res, "", results);
  } catch (err) {
    return ResponseHandler.internalServerError(res, err);
  }
};
