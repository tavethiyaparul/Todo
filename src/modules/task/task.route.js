import express from "express";
import {
  createTask,
  getTask,
  deleteTask,
  getTaskWiseId,
} from "./task.controller.js";
import { isAuthentication } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/", isAuthentication, createTask);

router.get("/", isAuthentication, getTask);

router.delete("/:id", isAuthentication, deleteTask);

router.get("/:id", isAuthentication, getTaskWiseId);

export default router;
