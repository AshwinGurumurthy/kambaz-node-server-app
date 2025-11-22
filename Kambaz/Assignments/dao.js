import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAllAssignments() {
    return db.assignments;
  }

  function findAssignments(courseId) {
  const { assignments } = db;
  const foundAssignments = assignments.filter((assignment) =>(assignment.course === courseId));
  return foundAssignments;
}

function findAssignment(assignmentId) {
  const { assignments } = db;
  const foundAssignment = assignments.find((assignment) =>(assignment._id === assignmentId));
  return foundAssignment;
}


function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  db.assignments = [...db.assignments, newAssignment];
  return newAssignment;
}

function deleteAssignment(assignmentId) {
    const {assignments} = db;
    db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = db;
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  Object.assign(assignment, assignmentUpdates);
  return assignmentUpdates;
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

