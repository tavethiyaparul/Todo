import express from "express";
import userRouter from "./modules/user/user.route.js";
import taskRouter from "./modules/task/task.route.js";

const router = express.Router();

router.use("/user", userRouter);

router.use("/task", taskRouter);

export default router;
