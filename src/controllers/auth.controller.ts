import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import ResponseHandler from "../libs";

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

export const signin = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
    if (err || !user) {
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

        const { _id, name, email } = user;
        ResponseHandler.success(res, "Signin success", {
          token,
          user: { _id, name, email },
        });
      }
    );
  });
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("t");
  ResponseHandler.success(res, "Signout successfully");
};
