import mongoose from "mongoose";
const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      message: "Title validation failed",
    },
    description: {
      type: String,
      message: "description validation failed",
    },
    duedate: {
      type: Number,
      message: "dueDate validation failed",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "in progress", "completed"],
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("task", taskSchema);
