import Task from "./task.model.js";
import responses from "../../../src/constants/responses.js";
import mongoose from "mongoose";
import ApiFeatures from "../../constants/apifeature.js";

export const createTask = async (req, res, next) => {
  try {
    const { id, title, description, duedate, priority, status } = req.body;

    if (id) {
      const editValue = {
        title,
        description,
        duedate,
        priority: +priority,
        status,
        user: req.user.id,
      };
      const task = await Task.findOneAndUpdate(
        { _id: id },
        { $set: editValue },
        { new: true }
      );

      return res.json(
        responses.OK({
          success: true,
          task: task,
        })
      );
    }

    if (!title) {
      return res.json(
        responses.DATA_NOT_FOUND({
          success: false,
        })
      );
    }

    const task = await Task.create({
      title,
      description,
      duedate,
      priority: +priority,
      status,
      user: req.user.id,
    });

    return res.json(
      responses.OK({
        success: true,
        task: task,
      })
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      if (error?.errors) {
        for (let field in error.errors) {
          return res.json(
            responses.BAD_REQUEST({
              success: false,
              message: error.errors[field].message,
            })
          );
        }
      } else {
        return res.json(
          responses.BAD_REQUEST({
            success: false,
            message: error.message,
          })
        );
      }
    }
    console.error("Error register:", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }
};

export const getTask = async (req, res, next) => {
  try {
    const taskCount = await Task.find({ user: req.user.id }).countDocuments();
    const apiFeature = new ApiFeatures(
      Task.find({ user: req.user.id }),
      req.query
    )
      .search()
      .filter()
      .sort();

    let task = await apiFeature.query;

    let filterTaskCount = task.length;

    apiFeature.pagination();

    task = await apiFeature.query.clone();

    return res.json(
      responses.OK({
        success: true,
        task: task,
        taskCount,
        resultPerPage: Number(req.query.resultPerPage),
        filterTaskCount,
      })
    );
  } catch (error) {
    console.error("Error getTask Location:", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }
};

export const getTaskWiseId = async (req, res, next) => {
  try {
    const isChecked = await Task.find({
      user: req.user.id,
      _id: req.params.id,
    });
    if (isChecked.length > 0) {
      const task = await Task.findById({ _id: req.params.id });
      return res.json(
        responses.OK({
          success: true,
          task: task,
        })
      );
    } else {
      return res.json(
        responses.BAD_REQUEST({
          success: true,
          message: "sorry,You can not access this Task",
        })
      );
    }
  } catch (error) {
    console.error("Error getTaskWiseId Location:", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const isChecked = await Task.find({
      user: req.user.id,
      _id: req.params.id,
    });
    if (isChecked.length > 0) {
      const task = await Task.deleteOne({ _id: req.params.id });
      return res.json(
        responses.OK({
          success: true,
          message: "Task deleted successfully",
        })
      );
    } else {
      return res.json(
        responses.BAD_REQUEST({
          success: true,
          message: "sorry,You can not Delete this task",
        })
      );
    }
  } catch (error) {
    console.error("Error deleteTask Location:", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }
};
