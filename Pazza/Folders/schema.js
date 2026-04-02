import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    _id: String,
    name: { type: String, required: true },
    course: {
        type: String,
        required: true,
        ref: "CourseModel"
    }
},
    { collection: "folders" }
);
FolderSchema.index({ name: 1, course: 1 }, { unique: true })
export default FolderSchema;

