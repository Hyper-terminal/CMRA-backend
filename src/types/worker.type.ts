import { Document } from "mongoose";
import { ITask } from "./task.type";

export interface IWorker extends Document {
  name: string;
  contact: {
    email?: string;
    phone: number;
    address: string;
  };
  tasks: ITask[];
  documents: {
    aadharCard?: string;
    drivingLicense?: string;
    panCard?: string;
  };
  salary: number;
  employeeId?: string;
  dateOfBirth: string;
  familyDetails: {
    father: {
      name: string;
      phone: number;
    };
    mother: {
      name: string;
      phone: number;
    };
    spouse: {
      name: string;
      phone: number;
    };
  };
}
