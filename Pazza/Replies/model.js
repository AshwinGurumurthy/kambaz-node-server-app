import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("RepliesModel", schema);
export default model;