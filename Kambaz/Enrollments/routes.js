import EnrollmentsDao from "../Enrollments/dao.js";
export default function EnrollmentRoutes(app, db) {

    const dao = EnrollmentsDao(db);
    const enrollUserInCourse = (req, res) => {
        const {courseId} = req.params;
        const userId = req.session["currentUser"]._id;
        const enrollments = dao.enrollUserInCourse(userId, courseId);
        res.json(enrollments);
    };

    const deleteCourse = async (req, res) => {
   const { courseId } = req.params;
   await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
   const status = await dao.deleteCourse(courseId);
   res.send(status);
 };


    const unenrollUserFromCourse = (req, res) => {
        const {courseId} = req.params;
        const userId = req.session["currentUser"]._id;
        const enrollments = dao.unenrollUserFromCourse(userId, courseId);
        res.json(enrollments);
    };

    const findEnrollmentsForUser = (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsForUser(userId);
        res.json(enrollments);
    };

    
    app.post("/api/courses/enrollments/:courseId/enroll", enrollUserInCourse);
    app.delete("/api/courses/enrollments/:courseId/unenroll", unenrollUserFromCourse);
    app.get("/api/users/enrollments/:userId/enrollments", findEnrollmentsForUser);
}