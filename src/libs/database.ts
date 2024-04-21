import mongoose from "mongoose";

class Database {
  public async connect(
    url: string,
    options?: mongoose.ConnectOptions
  ): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB");
      } else {
        await mongoose.connect(url, options);
        console.log("Connected to MongoDB");
      }
    } catch (error: any) {
      console.error("Failed to connect to MongoDB:", error?.message || error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 0) {
        console.log("No active MongoDB connection to disconnect");
      } else {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
      }
    } catch (error: any) {
      console.error(
        "Failed to disconnect from MongoDB:",
        error?.message || error
      );
      throw error;
    }
  }
}

export default new Database();
