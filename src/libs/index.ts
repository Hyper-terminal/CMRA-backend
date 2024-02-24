import { Response } from "express";

class ResponseHandler {
  static success(res: Response, message: string, data?: any) {
    res.status(200).json({ success: true, message, data });
  }

  static created(res: Response, message: string, data?: any) {
    res.status(201).json({ success: true, message, data });
  }

  static error(res: Response, statusCode: number, errorMessage: string) {
    res.status(statusCode).json({ success: false, error: errorMessage });
  }

  static internalServerError(res: Response, error: any) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

export default ResponseHandler;
