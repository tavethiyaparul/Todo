import express from "express";
import cors from "cors";
import responses from "./src/constants/responses.js";
import apiRouter from "./src/routes.js";
import cookieParser from "cookie-parser";

export async function createServer({ isProd }) {
  const app = express();


  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: "*" }))
  app.use(express.urlencoded({extended:true}))

  // return path
  let path;
  app.use((req, res, next) => {
    path = `Route Path ${req.method} = http://${req.hostname}:${process.env.PORT}${req.path} `;
    console.log(path);
    next(); // calling next middleware function or handler
  });

  app.use("/api", apiRouter);

  app.use((error, req, res, next) => {
    console.log("Error: ", error);

    return res.json(
      isProd ? responses.SERVER_ERROR() : responses.SERVER_ERROR({ error })
    );
  });

  return { app };
}
