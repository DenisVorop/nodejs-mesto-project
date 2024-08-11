import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";

import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";
import { errorHandler } from "./middleware/error";
import { createUser, login } from "./controllers/users";
import { errorLogger, requestLogger } from "./logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mestodb";

mongoose
  .connect(MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", userRoutes);
app.use("/", cardRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Запрашиваемый ресурс не найден" });
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
