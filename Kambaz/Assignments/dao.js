import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {

  function findAllAssignments(){
    return model.find();
  }

  function findAssignments(courseId) {
    return model.find({ course: courseId });
  }

  function findAssignment(assignmentId) {
    return model.findById(assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }


  function deleteAssignment(assignmentId) {
    return model.findByIdAndDelete(assignmentId);
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  }

  return {
  findAllAssignments,
  findAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment,
  findAssignments
};

}

