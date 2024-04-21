import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";

interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const REFRESH_TOKEN_EXPIRY = "7d";

const RefreshTokenSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);

const generateRefreshToken = async (
  userId: mongoose.Types.ObjectId
): Promise<string> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  // Check if there is an existing refresh token for the user
  const existingToken = await RefreshToken.findOne({ user: userId });

  if (existingToken && validateRefreshToken(existingToken.token)) {
    return existingToken.token;
  }

  // If an existing token is invalid or doesn't exist, generate a new one
  const token = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Example: Refresh token expires in 7 days

  // Remove any existing token before creating a new one
  if (existingToken) {
    await revokeRefreshToken(existingToken.token);
  }

  // Save the new refresh token to the database
  await RefreshToken.create({
    user: userId,
    token,
    expiresAt,
  });

  return token;
};

const revokeRefreshToken = async (token: string): Promise<void> => {
  await RefreshToken.deleteOne({ token });
};

const validateRefreshToken = (token: string): boolean => {
  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    return !!decodedToken;
  } catch (error) {
    // Token verification failed (invalid/expired token)
    return false;
  }
};

export {
  IRefreshToken,
  RefreshToken,
  generateRefreshToken,
  revokeRefreshToken,
};
