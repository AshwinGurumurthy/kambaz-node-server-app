import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    _id: String,
    author: { type: String, ref: "UserModel" },
    updated_by:{ type: String, ref: "UserModel" },
    details: String,
    timestamp: {type:Date,default:Date.now},
},
    { collection: "answers" }
);
export default AnswerSchema;