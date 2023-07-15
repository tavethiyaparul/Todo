import express from "express";
import { createTask,getTask,deleteTask } from "./task.controller.js";
import {isAuthentication} from "../../middlewares/auth.js"

const router = express.Router();

router.post("/", isAuthentication, createTask)

router.get("/:id",isAuthentication, getTask);

router.delete("/:id",isAuthentication, deleteTask);

export default router;