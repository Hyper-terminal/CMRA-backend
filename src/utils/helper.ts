import Employee from "../models/employee.model";
import Worker from "../models/worker.model";

export const uniqueMobileInEmployeeAndWorker = async (
  mobile: string | number
) => {
  const employee = await Employee.findOne({ "contact.phone": mobile });
  const worker = await Worker.findOne({ "contact.phone": mobile });
  if (employee || worker) {
    return false;
  }
  return true;
};
