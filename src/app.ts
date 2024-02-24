import dotenv from "dotenv";
import express, { Express } from "express";
import { userRoutes, authRoutes } from "./routes";
import database from "./libs/database";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// database.connect(process.env.MONGODB_URI as string);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
