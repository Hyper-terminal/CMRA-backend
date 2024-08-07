import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import {Request, Response} from "express";
import ResponseHandler from "../libs";
import Task from "../models/task.model";
import {ITask} from "../types/task.type";
import twilio from "twilio";

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
        const results = await Task.find()
            .select("-otp -otpExpires")
            .populate("service")
            .sort("-createdAt");
        return ResponseHandler.success(res, "", results);
    } catch (error) {
        return ResponseHandler.internalServerError(res, error);
    }
};

export const startTask = async (req: Request, res: Response) => {
    try {
        const {taskId} = req.body;
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
            {taskId: task._id, status: task.status}
        );
    } catch (error) {
        return ResponseHandler.internalServerError(res, error);
    }
};

const sendOtpToClient = async (phone: number, otp: string) => {
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_SIDTWILIO_AUTH_TOKEN);
        await client.messages
            .create({
                body: `Your OTP for CMRA service is : ${otp}`,
                from: process.env.TWILIO_PHONE,
                to: '+917011219336'
            });
    } catch (err) {
        console.error(err)
    }
};

export const generateOtp = async (req: Request, res: Response) => {
    try {
        const {taskId} = req.body;
        const task: ITask | null = await Task.findById(taskId);
        if (!task) {
            return ResponseHandler.error(res, 404, "Task not found");
        }

        const otp = randomBytes(2)
            .readUInt16BE()
            .toString()
            .padStart(4, "0")
            .slice(0, 4);
        const hashedOtp = await bcrypt.hash(String(otp), 10);
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 5);

        task.otp = hashedOtp;
        task.otpExpires = otpExpires;
        await task.save();
        await sendOtpToClient(task.clientPhone, otp);

        return ResponseHandler.success(res, "OTP generated successfully", {otp});
    } catch (error) {
        return ResponseHandler.internalServerError(res, error);
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const {taskId, otp} = req.body;
        const task: ITask | null = await Task.findById(taskId);
        if (!task) {
            return ResponseHandler.error(res, 404, "Task not found");
        }

        // Check if the OTP has expired
        if (new Date() > task.otpExpires) {
            return ResponseHandler.error(res, 400, "OTP has expired");
        }

        const isOtpValid = await bcrypt.compare(String(otp), String(task.otp));
        if (!isOtpValid) {
            return ResponseHandler.error(res, 400, "Invalid OTP");
        }

        return ResponseHandler.success(res, "OTP verified successfully");
    } catch (error) {
        return ResponseHandler.internalServerError(res, error);
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const task = await Task.findById(id)
            .select("-otp -otpExpires")
            .populate("assignedWorkers")
            .populate("assignedServiceManager")
            .populate("service");
        if (!task) {
            return ResponseHandler.error(res, 404, "Task not found");
        }
        return ResponseHandler.success(res, "", task);
    } catch (error) {
        return ResponseHandler.internalServerError(res, error);
    }
};
