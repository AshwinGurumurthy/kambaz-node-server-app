import model from "./model.js";
export default function EnrollmentsDao(db) {
  
 /* async function findCoursesForUser(userId) {
   const enrollments = await model.find({ user: userId }).populate("course");
   return enrollments.map((enrollment) => enrollment.course);
 } */

async function findCoursesForUser(userId) {
 const enrollments = await model.find({ user: userId }).populate("course");
 return enrollments.map((enrollment) => enrollment.course);
}



 async function findUsersForCourse(courseId) {
   const enrollments = await model.find({ course: courseId }).populate("user");
   return enrollments.map((enrollment) => enrollment.user);
 }


 async function enrollUserInCourse(userId, courseId) {
  const _id = `${userId}-${courseId}`;

  const existing = await model.findById(_id);
  if (existing) {
    return existing; 
  }

  return model.create({
    _id,
    user: userId,
    course: courseId,
  });
}

 async function unenrollUserFromCourse(user, course) {
   return model.deleteOne({ user, course });
 }

 

 async function unenrollAllUsersFromCourse(courseId) {
   return model.deleteMany({ course: courseId });
 }


 return {
   findCoursesForUser,
   findUsersForCourse,
   enrollUserInCourse,
   unenrollUserFromCourse,
   unenrollAllUsersFromCourse,

 };
}

