import EnrollmentsDao from "../Enrollments/dao.js";
export default function EnrollmentRoutes(app, db) {

    const dao = EnrollmentsDao(db);
    const enrollUserInCourse = (req, res) => {
        const {courseId} = req.params;
        const userId = req.session["currentUser"]._id;
        const enrollments = dao.enrollUserInCourse(userId, courseId);
        res.json(enrollments);
    };

    const unenrollUserFromCourse = (req, res) => {
        const {courseId} = req.params;
        const userId = req.session["currentUser"]._id;
        const enrollments = dao.unenrollUserFromCourse(userId, courseId);
        res.json(enrollments);
    };

    app.post("/api/users/:userId/courses/:courseId/enroll", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId/unenroll", unenrollUserFromCourse);
}