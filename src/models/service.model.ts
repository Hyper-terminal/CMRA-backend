import mongoose, { Schema, Document } from "mongoose";
import { IService } from "../types/service.type";

const serviceSchema = new Schema<IService>({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
    unique: true, // Ensure each service has a unique value
  },
});

const Service = mongoose.model<IService>("Service", serviceSchema);

// Function to seed initial services
const seedServices = async () => {
  try {
    // Check if any services already exist in the database
    const existingServices = await Service.find();

    if (existingServices.length === 0) {
      // If no services exist, seed the initial services
      const initialServices = [
        { label: "Fumigation", value: "Fumigation" },
        { label: "Plumbing", value: "Plumbing" },
        { label: "Termite", value: "Termite" },
        { label: "Fleas", value: "Fleas" },
        { label: "Pest Control", value: "Pest Control" },
      ];

      // Insert the initial services into the database
      await Service.insertMany(initialServices);
      console.log("Initial services seeded successfully.");
    } else {
      console.log("Services already exist in the database.");
    }
  } catch (error) {
    console.error("Error seeding initial services:", error);
  }
};

// Seed initial services when the application starts (optional)
seedServices();

export default Service;
