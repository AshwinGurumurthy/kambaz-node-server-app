import EnrollmentsDao from "../../Kambaz/Enrollments/dao.js";
import PostsDao from "../Posts/dao.js";

export default function PazzaDashboardRoutes(app) {
    const postDao = PostsDao();
    const enrollmentDao = EnrollmentsDao();
    const getDashboardContent = async (req, res) => {
        const { courseId } = req.params;
        const currentUserId = req.session["currentUser"]._id;
        const response_json = {
            "count_unread_posts": await postDao.getUnReadPostCount(courseId, currentUserId),
            "count_unanswered_questions": await postDao.getUnAnsweredQuestions(courseId),
            "count_total_posts": await postDao.getTotalPostCount(courseId),
            "count_students_enrolled": await enrollmentDao.findUsersForCourse()
        }
        res.json(folders)
    }
    app.get("/api/pazza/:courseId/dashboard", getDashboardContent)
};