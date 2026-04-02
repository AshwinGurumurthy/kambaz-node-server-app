import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAllAssignments = async (req, res) => {
    const assignments = await dao.findAllAssignments();
    res.json(assignments);
  };

  const findAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignment(assignmentId);
    res.json(assignment);
  };

  const findAssignments = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignments(courseId);
    res.json(assignments);
  };

  const createAssignment = async (req, res) => {
    const assignment = await dao.createAssignment(req.body);
    res.json(assignment);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const result = await dao.deleteAssignment(assignmentId);
    res.json(result);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const result = await dao.updateAssignment(assignmentId, req.body);
    res.json(result);
  };

  app.post("/api/assignments", createAssignment);

  app.get("/api/assignments/course/:courseId", findAssignments);

  app.get("/api/assignments/:assignmentId", findAssignment);

  app.put("/api/assignments/:assignmentId", updateAssignment);

  app.delete("/api/assignments/:assignmentId", deleteAssignment);

  app.get("/api/assignments", findAllAssignments);
}
