import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAllAssignments = (req, res) => {
    res.send(dao.findAllAssignments());
  };

  const findAssignment = (req, res) => {
    const { assignmentId } = req.params;
    res.json(dao.findAssignment(assignmentId));
  };

  const findAssignments = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findAssignments(courseId));
  };

  const createAssignment = (req, res) => {
    res.json(dao.createAssignment(req.body));
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    res.send(dao.deleteAssignment(assignmentId));
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    res.send(dao.updateAssignment(assignmentId, req.body));
  };

  app.post("/api/assignments", createAssignment);

  app.get("/api/assignments/course/:courseId", findAssignments);

  app.get("/api/assignments/:assignmentId", findAssignment);

  app.put("/api/assignments/:assignmentId", updateAssignment);

  app.delete("/api/assignments/:assignmentId", deleteAssignment);

  app.get("/api/assignments", findAllAssignments);
}
