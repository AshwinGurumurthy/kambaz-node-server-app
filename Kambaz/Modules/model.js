import mongoose from "mongoose";
import schema from "./schema.js";

const ModuleModel = mongoose.model("modules", schema);
export default ModuleModel;
