import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ResponseHandler from "../libs";
import User from "../models/user.model";

const TOKEN_EXPIRY = "1h"; // Example: Token expiry time

export const signup = async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return ResponseHandler.error(res, 403, "Email is taken");
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.SECRET!, {
      expiresIn: TOKEN_EXPIRY,
    });
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 9999);
    res.cookie("t", token, { expires: expirationDate });

    const { _id, name, email, role } = user;
    ResponseHandler.success(res, "Signup success! Please login.", {
      token,
      user: { _id, name, email, role },
    });
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

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return ResponseHandler.error(res, 401, "Email and password do not match");
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET!, {
      expiresIn: TOKEN_EXPIRY,
    });
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 9999);
    res.cookie("t", token, { expires: expirationDate });

    const { _id, name, email, role } = user;
    ResponseHandler.success(res, "Signin success", {
      token,
      user: { _id, name, email, role },
    });
  } catch (error) {
    ResponseHandler.internalServerError(res, error);
  }
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("t");
  ResponseHandler.success(res, "Signout successfully");
};
