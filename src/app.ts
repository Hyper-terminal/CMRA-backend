import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
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
morgan.token("body", (req: Request) =>
  req.body && req.method !== "GET" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(
    "Method- :method URL- :url Status- :status Response-Time- :response-time ms Payload- :body"
  )
);

// set security HTTP headers
app.use(helmet());

// to prevent parameter pollution
app.use(hpp());

// database
database.strictMode();
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
