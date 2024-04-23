import { Response } from "express";
import ResponseHandler from "../libs";
import { IRequest } from "../middlewares";
import Task from "../models/task.model";
import Worker from "../models/worker.model";
import { IWorker } from "../types/worker.type";

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

    if (familyDetails?.length < 1) {
      return ResponseHandler.error(res, 400, "Please provide family details");
    }

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
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(pageSize as string));

    return ResponseHandler.success(res, "", { results, totalCount });
  } catch (err) {
    return ResponseHandler.internalServerError(res, err);
  }
};

export const getTotalSalary = async (req: IRequest, res: Response) => {
  try {
    const results = await Worker.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};

export const getWorkerById = async (req: IRequest, res: Response) => {
  try {
    const { id } = req.query;
    const results = await Worker.findById(id).populate({
      path: "tasks",
      model: Task,
    });
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};
