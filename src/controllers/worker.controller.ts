import { Response } from "express";
import { IRequest } from "../middlewares";
import Worker from "../models/worker.model";
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
    // If an error occurs, respond with an error message
    return ResponseHandler.internalServerError(res, error);
  }
};
