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
  costOfService: {
    type: Number,
    required: true,
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
        { label: "Fumigation", value: "Fumigation", costOfService: 1000 },
        { label: "Plumbing", value: "Plumbing", costOfService: 1000 },
        { label: "Termite", value: "Termite", costOfService: 1000 },
        { label: "Fleas", value: "Fleas", costOfService: 1000 },
        { label: "Pest Control", value: "Pest Control", costOfService: 1000 },
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
