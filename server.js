import express from "express";
import cors from "cors";
import responses from "./src/constants/responses.js";
import apiRouter from "./src/routes.js";
import cookieParser from "cookie-parser";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export async function createServer({ isProd }) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: "*" }));

  let pathUrl;
  app.use((req, res, next) => {
    pathUrl = `Route Path ${req.method} = http://${req.hostname}:${process.env.PORT}${req.path} `;
    console.log(pathUrl);
    next(); // calling next middleware function or handler
  });

  app.use("/api", apiRouter);

  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });

  app.use((error, req, res, next) => {
    console.log("Error: ", error);

    return res.json(
      isProd ? responses.SERVER_ERROR() : responses.SERVER_ERROR({ error })
    );
  });

  return { app };
}
