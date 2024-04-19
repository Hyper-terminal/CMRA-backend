import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ResponseHandler from "../libs";
import User from "../models/user.model";

export const signup = async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return ResponseHandler.error(res, 403, "Email is taken");
    }

    const user = new User(req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    await user.save();

    ResponseHandler.success(res, "Signup success! Please login.");
  } catch (error) {
    ResponseHandler.internalServerError(res, error);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return ResponseHandler.error(
        res,
        401,
        "User with that email doesn't exist. Please signup."
      );
    }

    bcrypt.compare(
      req.body.password,
      user.password,
      function (compareErr, result) {
        if (compareErr || !result) {
          return ResponseHandler.error(
            res,
            401,
            "Email and password do not match"
          );
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET!, {
          expiresIn: "1h",
        });
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 9999);
        res.cookie("t", token, { expires: expirationDate });

        const { _id, name, email, role } = user;
        ResponseHandler.success(res, "Signin success", {
          token,
          user: { _id, name, email, role },
        });
      }
    );
  } catch (error) {
    ResponseHandler.internalServerError(res, error);
  }
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("t");
  ResponseHandler.success(res, "Signout successfully");
};
