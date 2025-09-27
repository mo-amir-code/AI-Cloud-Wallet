import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandling/index.js";
import apiRoutes from "./routes/index.js";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { customizedCors } from "./config/cors.js";
import cors from "cors"

const app = express();

export const prisma = new PrismaClient();

// To keep server live on the onrender server
app.get("/ping", (_req, res) => {
  res.json("pong");
});


app.use(cors(customizedCors))
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(apiRoutes);
app.use(errorHandler);

export { app };
