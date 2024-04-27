import { Request, Response } from "express";
import ResponseHandler from "../libs";
import Task from "../models/task.model";
import Worker from "../models/worker.model";
import { IWorker } from "../types/worker.type";

// Function to create a new worker
export const createWorker = async (req: Request, res: Response) => {
  try {
    // Destructure worker details from request body
    const {
      name,
      contact,
      tasks,
      documents,
      salary,
      dateOfBirth,
      familyDetails,
    } = req.body;

    // Validate family details
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
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};

// Function to retrieve all workers
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for search, pagination
    const { search, page = 1, pageSize = 20 } = req.query;
    let query = {};

    // Construct search query if search term is provided
    if (search) {
      query = {
        $or: [{ name: { $regex: new RegExp(search as string, "i") } }],
      };
    }

    // Calculate number of documents to skip based on page number
    const skip = ((page as number) - 1) * parseInt(pageSize as any);

    // Count total number of workers that match the query
    const totalCount: number = await Worker.countDocuments(query);

    // Retrieve workers based on query, sorted by last updated date
    const results: IWorker[] = await Worker.find(query)
      .populate({
        path: "tasks",
        model: Task,
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(pageSize as string));

    // Respond with success and the retrieved workers
    return ResponseHandler.success(res, "", { results, totalCount });
  } catch (err) {
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, err);
  }
};

// Function to calculate the total salary of all workers
export const getTotalSalary = async (req: Request, res: Response) => {
  try {
    // Aggregate to calculate total salary
    const results = await Worker.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    // Respond with success and the total salary
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};

// Function to retrieve a worker by their ID
export const getWorkerById = async (req: Request, res: Response) => {
  try {
    // Extract worker ID from query parameters
    const { id } = req.query;
    // Find worker by ID and populate their tasks
    const results = await Worker.findById(id).populate({
      path: "tasks",
      model: Task,
    });

    // Respond with success and the worker details
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};

// Function to update a worker's details
export const updateWorker = async (req: Request, res: Response) => {
  try {
    // Find the existing worker by ID provided in request body
    const existingWorker = await Worker.findById(req.body._id);

    // Check if worker exists
    if (!existingWorker) {
      return ResponseHandler.error(res, 404, "Worker not found");
    }

    // Update worker details with new data from request body
    Object.assign(existingWorker, req.body);

    // Save the updated worker document
    const updatedWorker = await existingWorker.save();

    // Respond with success and the updated worker details
    return ResponseHandler.success(
      res,
      "Worker updated successfully",
      updatedWorker
    );
  } catch (error) {
    // If an error occurs, send an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};

// Function to retrieve tasks assigned to a specific worker
export const getWorkerTasks = async (req: Request, res: Response) => {
  try {
    // Extract worker ID and search parameters from query
    const { workerId, search, page = 1, pageSize = 20 } = req.query;
    // Validate worker ID
    if (!workerId) {
      return ResponseHandler.error(res, 400, "Worker ID is required");
    }

    // Find worker by ID
    const worker = await Worker.findById(workerId);
    // Check if worker exists
    if (!worker) {
      return ResponseHandler.error(res, 404, "Worker not found");
    }

    // Construct match query for tasks based on search term
    const matchQuery = search ? { name: { $regex: new RegExp(search as string, 'i') } } : {};
    // Count total tasks that match the query
    const totalCount = await Task.countDocuments({ _id: { $in: worker.tasks }, ...matchQuery });

    // Retrieve tasks based on query, sorted by last updated date
    const tasks = await Task.find({ _id: { $in: worker.tasks }, ...matchQuery })
      .sort({ updatedAt: -1 })
      .skip((page as number - 1) * parseInt(pageSize as any))
      .limit(parseInt(pageSize as string));

    // Respond with success and the tasks assigned to the worker
    return ResponseHandler.success(res, "", { tasks, totalCount });
  } catch (error) {
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};