import { Response } from "express";
import Service from "../models/service.model";
import ResponseHandler from "../libs";
import Employee from "../models/employee.model";
import Worker from "../models/worker.model";

export const getAllService = async (req: Request, res: Response) => {
  try {
    const results = await Service.find();
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};

export const getTotalSalary = async (req: Request, res: Response) => {
  try {
    // Execute both aggregation queries concurrently using Promise.all
    const [employeeResults, workerResults] = await Promise.all([
      Employee.aggregate([
        {
          $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
          },
        },
      ]),
      Worker.aggregate([
        {
          $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
          },
        },
      ]),
    ]);

    // Calculate total salary for all types of employees
    const totalSalary = {
      employees:
        employeeResults.length > 0 ? employeeResults[0].totalSalary : 0,
      workers: workerResults.length > 0 ? workerResults[0].totalSalary : 0,
    };

    // Return total salary data in the response
    return ResponseHandler.success(res, "", totalSalary);
  } catch (error) {
    // Handle errors
    return ResponseHandler.internalServerError(res, error);
  }
};
