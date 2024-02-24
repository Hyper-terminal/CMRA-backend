import { Document, Schema, model } from "mongoose";
interface ICustomError extends Document {
  message: string;
}

const CustomErrorSchema = new Schema<ICustomError>({
  message: {
    type: String,
    required: true,
  },
});

const CustomErrorModel = model<ICustomError>("CustomError", CustomErrorSchema);

export { CustomErrorModel };
