import { Response } from "express";
import ResponseHandler from "../libs";
import { IRequest } from "../middlewares";
import Employee from "../models/employee.model";
import Task from "../models/task.model";
import { IEmployee } from "../types/employee.type";

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

    if (familyDetails?.length < 1) {
      return ResponseHandler.error(res, 400, "Please provide family details");
    }

    // Create a new Employee document
    const newEmployee = new Employee({
      name,
      contact,
      tasks,
      documents,
      salary,
      dateOfBirth,
      familyDetails,
    });

    // Save the Employee document to the database
    await newEmployee.save();

    // Respond with the created Employee document
    return ResponseHandler.created(
      res,
      "Employee created successfully",
      newEmployee
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

    // Count total number of Employees that match the query
    const totalCount: number = await Employee.countDocuments(query);

    const results: IEmployee[] = await Employee.find(query)
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
    const results = await Employee.aggregate([
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

export const getEmployeeById = async (req: IRequest, res: Response) => {
  try {
    const { id } = req.query;
    const results = await Employee.findById(id).populate({
      path: "tasks",
      model: Task,
    });
    return ResponseHandler.success(res, "", results);
  } catch (error) {
    return ResponseHandler.internalServerError(res, error);
  }
};

export const updateEmployee = async (req: IRequest, res: Response) => {
  try {
    // Find the Employee document with the provided id and update it with the data in req.body.
    const response = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document instead of the original.
    });

    if (!response) {
      return ResponseHandler.error(res, 404, "Employee not found");
    }

    return ResponseHandler.success(
      res,
      "Employee updated successfully",
      response
    );
  } catch (error) {
    // If an error occurs, send an error message in the response.
    return ResponseHandler.internalServerError(res, error);
  }
};
