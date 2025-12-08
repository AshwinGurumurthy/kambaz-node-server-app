import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    course: { type: String, ref: "CourseModel" },
    points: Number,
    availFrom: Date,
    availFromTime: String,
    dueDate: Date,
    dueTime: String,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
