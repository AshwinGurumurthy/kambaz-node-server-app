import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import CourseModel from "../../Kambaz/Courses/model.js"
import PostModel from "../Posts/model.js";

export default function PazzaFolderDao() {
    function findFoldersForCourse(courseId) {
        return model.find({ "course": courseId })
    }
    function createFolder(courseId, folder) {
        if (Array.isArray(folder)) {
            const updatedFolder = folder.map(f => {
                return {
                    _id: uuidv4(),
                    course: courseId,
                    name: f
                }
            })
            return model.insertMany(updatedFolder)
        } else {
            const newFolder = { ...folder, _id: uuidv4(), course: courseId };
            return model.create(newFolder);
        }
    }
    function updateFolderName(fid, folderName) {
        return model.updateOne({ _id: fid }, { name: folderName })
    }
    function deleteFolders(cid, folderNames) {
        return model.deleteMany({ name: { $in: folderNames }, course: cid })
    }

    function findPostsBasedOnFolderFilter(folderId, userId) {
        return PostModel.find({ folder: folderId,
            $or: [
              { audience: { $exists: false } },   
              { audience: { $size: 0 } },        
              { audience: "ALL" },                
              { audience: userId },               
              { author: userId },                 
            ],
        });
    }

    function getAllFolders() {
        return model.find({});
    }
    
    return {
        findFoldersForCourse,
        createFolder,
        deleteFolders,
        updateFolderName,
        findPostsBasedOnFolderFilter,
        getAllFolders
    }
};
