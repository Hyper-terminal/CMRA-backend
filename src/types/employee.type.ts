import { Document } from "mongoose";
import { ITask } from "./task.type";

export interface IEmployee extends Document {
  employeeId: string;
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
  dateOfBirth: string;
  familyDetails: {
    name: string;
    phone: number;
  }[];
}
