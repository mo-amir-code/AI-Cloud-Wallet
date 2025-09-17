import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandling/index.js";
import apiRoutes from "./routes/index.js";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

// import { WHITELISTED_ORIGINS } from "./config/constants.js";

const app = express();

export const prisma = new PrismaClient();

// To keep server live on the onrender server
app.get("/ping", (_req, res) => {
  res.json("pong");
});

app.use(
  cors({
    // origin: function (origin: any, callback: any) {
    //   if (WHITELISTED_ORIGINS.indexOf(origin) !== -1) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("You are very chalak bro....."));
    //   }
    // },
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(apiRoutes);
app.use(errorHandler);

export { app };
