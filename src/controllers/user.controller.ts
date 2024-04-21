import { Response } from "express";
import ResponseHandler from "../libs";
import { IRequest } from "../middlewares";
import Task from "../models/task.model";
import Worker from "../models/worker.model";
import { IWorker } from "../types/worker.type";

export const createEmployee = async (req: IRequest, res: Response) => {
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
      "Employee created successfully",
      newWorker
    );
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with an error message
    return ResponseHandler.internalServerError(res, error);
  }
};

export const getAllEmployees = async (req: IRequest, res: Response) => {
  try {
    // extract query params
    const { search, page = 1, pageSize = 20 } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [{ name: { $regex: new RegExp(search as string, "i") } }],
      };
    }

    const skip = ((page as number) - 1) * parseInt(pageSize as any);

    // Count total number of workers that match the query
    const totalCount: number = await Worker.countDocuments(query);

    const results: IWorker[] = await Worker.find(query)
      .populate({
        path: "tasks",
        model: Task,
      })
      .skip(skip)
      .limit(parseInt(pageSize as string));

    return ResponseHandler.success(res, "", { results, totalCount });
  } catch (err) {
    return ResponseHandler.internalServerError(res, err);
  }
};
