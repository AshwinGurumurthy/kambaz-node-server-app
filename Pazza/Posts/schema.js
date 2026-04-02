import mongoose from "mongoose";
import FollowupSchema from "../Followup/schema.js";

const postSchema = new mongoose.Schema(
  {
    _id: String,
    post_type: {
      type: String,
      enum: ["QUESTION", "NOTE", "POLL"],
      default: "QUESTION",
    },
    read_by: [
      {
        type: String,
        ref: "UserModel",
      },
    ],
    student_answer: { type: String, ref: "AnswerModel" },
    instructor_answer: { type: String, ref: "AnswerModel" },
    is_private: Boolean,
    is_anonymous: Boolean,
    course: { type: String, ref: "CourseModel" },
    author: { type: String, ref: "UserModel" },
    folder: { type: String, ref: "FolderModel" },
    summary: String,
    details: String,
    follow_ups: [FollowupSchema],
    timestamp: { type: Date, default: Date.now },
    audience: [
      {
        type: String,
        ref: "UserModel",
      },
    ],
  },
  { collection: "posts" }
);
export default postSchema;
