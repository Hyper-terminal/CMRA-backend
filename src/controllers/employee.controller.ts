import { Request, Response } from "express";
import ResponseHandler from "../libs";
import Employee from "../models/employee.model";
import Task from "../models/task.model";
import { IEmployee } from "../types/employee.type";
import { uniqueMobileInEmployeeAndWorker } from "../utils/helper";
import { startSession } from "mongoose";

export const createEmployee = async (req: Request, res: Response) => {
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

    // validate number
    const isUnique = await uniqueMobileInEmployeeAndWorker(contact.phone);
    if (!isUnique) {
      return ResponseHandler.error(res, 400, "Mobile number already exists");
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

export const getAllEmployees = async (req: Request, res: Response) => {
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

export const getTotalSalary = async (req: Request, res: Response) => {
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

export const getEmployeeById = async (req: Request, res: Response) => {
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

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const existingEmployee = await Employee.findById(req.body._id);

    if (!existingEmployee) {
      return ResponseHandler.error(res, 404, "Employee not found");
    }

    Object.assign(existingEmployee, req.body);

    const updatedEmployee = await existingEmployee.save();

    return ResponseHandler.success(
      res,
      "Employee updated successfully",
      updatedEmployee
    );
  } catch (error) {
    // If an error occurs, send an error message in the response.
    return ResponseHandler.internalServerError(res, error);
  }
};

// Function to retrieve tasks assigned to a specific employee
export const getEmployeeTasks = async (req: Request, res: Response) => {
  try {
    // Extract employee ID and search parameters from query
    const { employeeId, search, page = 1, pageSize = 20 } = req.query;
    // Validate employee ID
    if (!employeeId) {
      return ResponseHandler.error(res, 400, "Employee ID is required");
    }

    // Find employee by ID
    const employee = await Employee.findById(employeeId);
    // Check if employee exists
    if (!employee) {
      return ResponseHandler.error(res, 404, "Employee not found");
    }

    // Construct match query for tasks based on search term
    const matchQuery = search
      ? { name: { $regex: new RegExp(search as string, "i") } }
      : {};
    // Count total tasks that match the query
    const totalCount = await Task.countDocuments({
      _id: { $in: employee.tasks },
      ...matchQuery,
    });

    // Retrieve tasks based on query, sorted by last updated date
    const tasks = await Task.find({
      _id: { $in: employee.tasks },
      ...matchQuery,
    })
      .sort({ updatedAt: -1 })
      .skip(((page as number) - 1) * parseInt(pageSize as any))
      .limit(parseInt(pageSize as string));

    // Respond with success and the tasks assigned to the employee
    return ResponseHandler.success(res, "", { tasks, totalCount });
  } catch (error) {
    // If an error occurs, respond with an internal server error message
    return ResponseHandler.internalServerError(res, error);
  }
};

export const assignTaskToEmployee = async (req: Request, res: Response) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const { taskId, employeeId } = req.body;
    const employee = await Employee.findById(employeeId).session(session);
    const task = await Task.findById(taskId).session(session);

    if (!employee) {
      await session.abortTransaction();
      return ResponseHandler.error(res, 404, "Employee not found");
    }
    if (!task) {
      await session.abortTransaction();
      return ResponseHandler.error(res, 404, "Task not found");
    }

    // Update task status and assigned employees
    task.status = "Assigned";
    task.assignedServiceManager.push(employee._id);
    await task.save({ session });

    // Assign task to worker
    employee.tasks.push(taskId);
    await employee.save({ session });

    await session.commitTransaction();
    return ResponseHandler.success(
      res,
      "Task assigned to employee successfully",
      { employee, task }
    );
  } catch (error) {
    await session.abortTransaction();
    return ResponseHandler.internalServerError(res, error);
  } finally {
    session.endSession();
  }
};
