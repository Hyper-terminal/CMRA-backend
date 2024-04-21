import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import hpp from "hpp";
import database from "./libs/database";
import {
  authRoutes,
  employeeRoutes,
  serviceRoutes,
  taskRoutes,
  userRoutes,
  workerRoutes,
} from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// set security HTTP headers
app.use(helmet());

// to prevent parameter pollution
app.use(hpp());

database.connect(process.env.MONGO_URI as string);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/worker", workerRoutes);
app.use("/employee", employeeRoutes);
app.use("/task", taskRoutes);
app.use("/service", serviceRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
