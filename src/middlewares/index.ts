import { NextFunction, Response } from "express";

import jwt from "jsonwebtoken";
import ResponseHandler from "../libs";

export const requireSignin = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return ResponseHandler.error(res, 401, "Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET!);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return ResponseHandler.error(res, 401, "Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      return ResponseHandler.error(res, 401, "Invalid token");
    }
    // Handle other errors as needed
    return ResponseHandler.internalServerError(res, error);
  }
};
