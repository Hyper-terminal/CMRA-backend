import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export interface IRequest extends Request {
  user: any;
}

export const requireSignin = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET!);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    // Handle other errors as needed
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
