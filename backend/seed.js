// seed.js - loads the starter data in Kambaz/Database into MongoDB.
// Safe to re-run: every document is upserted by its _id, so nothing is
// duplicated. Re-running resets the demo records; anything users created
// through the app is left alone.
//
// Logins: only the two shared demo accounts below have known passwords.
// Roster users from Kambaz/Database get a fresh random password on every
// run, so the plain-text passwords in that file never work. Set
// ADMIN_PASSWORD to also create a private "admin" account.
import "dotenv/config";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import db from "./Kambaz/Database/index.js";
import quizzes from "./Kambaz/Database/quizzes.js";
import quizQuestions from "./Kambaz/Database/quizQuestions.js";
import attempts from "./Kambaz/Database/attempts.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/Kambaz";

// Modules live inside their course document (see Courses/schema.js)
const courses = db.courses.map((course) => ({
  ...course,
  modules: db.modules.filter((module) => module.course === course._id),
}));

const DEMO_PASSWORD = "KanvasDemo1";
const demoUsers = [
  { _id: "demo-faculty", username: "demo_faculty", firstName: "Demo", lastName: "Faculty", role: "FACULTY" },
  { _id: "demo-student", username: "demo_student", firstName: "Demo", lastName: "Student", role: "STUDENT" },
].map((user) => ({ ...user, password: DEMO_PASSWORD, section: "S101", demo: true }));
const demoEnrollments = [
  ["demo-faculty", "RS101"], ["demo-faculty", "RS102"], ["demo-faculty", "RS103"],
  ["demo-student", "RS101"], ["demo-student", "RS102"],
].map(([user, course]) => ({ _id: `${user}-${course}`, user, course }));

const users = [
  ...db.users.map((user) => ({
    ...user,
    password: randomBytes(24).toString("base64url"),
  })),
  ...demoUsers,
];
if (process.env.ADMIN_PASSWORD) {
  users.push({
    _id: "site-admin",
    username: "admin",
    password: process.env.ADMIN_PASSWORD,
    firstName: "Site",
    lastName: "Admin",
    role: "ADMIN",
  });
}

const collections = {
  users,
  courses,
  assignments: db.assignments,
  enrollments: [...db.enrollments, ...demoEnrollments],
  quizzes,
  quizQuestions,
  attempts,
};

await mongoose.connect(CONNECTION_STRING);
for (const [name, docs] of Object.entries(collections)) {
  const result = await mongoose.connection.db.collection(name).bulkWrite(
    docs.map((doc) => ({
      replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
    }))
  );
  console.log(
    `${name}: ${result.upsertedCount} added, ${result.modifiedCount} reset`
  );
}
await mongoose.disconnect();
