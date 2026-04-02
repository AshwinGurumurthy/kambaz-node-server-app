import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  _id: String,
  author: { type: String, ref: "UserModel" },
  details: String,
  timestamp: { type: Date, default: Date.now },
  replies: [
    {
      _id: { type: String },
      author: { type: String, ref: "UserModel" },
      details: String,
      timestamp: { type: Date, default: Date.now },
      replies: [],
    },
  ],
});
replySchema.add({ replies: [replySchema] });
export default replySchema;
