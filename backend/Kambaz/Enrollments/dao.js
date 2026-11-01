// Kambaz/Enrollments/dao.js
import model from "./model.js";

export default function EnrollmentsDao() {  // Removed db parameter
  
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }
  
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }
 
  async function enrollUserInCourse(userId, courseId) {  // Added async
    return await model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,  // Composite key to ensure uniqueness
    });
  }
  
  async function unenrollUserFromCourse(userId, courseId) {  // Added async, fixed parameters
    return await model.deleteOne({ user: userId, course: courseId });
  }
  
  async function findEnrollmentsForUser(userId) {  // Added this function back
    return await model.find({ user: userId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    unenrollAllUsersFromCourse
  };
}