// app/(kambaz)/Courses/reducer.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { courses, enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";

const getInitialEnrollments = () => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    const storedEnrollments = sessionStorage.getItem('enrollments');
    return storedEnrollments ? JSON.parse(storedEnrollments) : enrollments;
  }
  // Return default enrollments on server side
  return enrollments;
};

const initialState = {
  courses: courses,
  enrollments: getInitialEnrollments(),
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    
    // ADD THIS NEW ACTION
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
      // Update sessionStorage with the new enrollments
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('enrollments', JSON.stringify(action.payload));
      }
    },
    
    addCourse: (state, { payload: Course }) => {
      // Use the course as-is from the server (it already has the correct _id)
      const newCourse: any = {
        _id: Course._id || uuidv4(), // Use server ID if available, otherwise generate
        name: Course.name,
        number: Course.number,
        startDate: Course.startDate,
        endDate: Course.endDate,
        department: Course.department,
        credits: Course.credits,
        description: Course.description,
        image: Course.image, // Include the image property
      };
      state.courses = [...state.courses, newCourse] as any;
    },
    deleteCourse: (state, { payload: CourseId }) => {
      state.courses = state.courses.filter(
        (c: any) => c._id !== CourseId);
    },
    updateCourse: (state, { payload: { course } }) => {
      state.courses = state.courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    },
    editCourse: (state, { payload: CourseId }) => {
      state.courses = state.courses.map((c: any) =>
        c._id === CourseId ? { ...c, editing: true } : c
      ) as any;
    },
    enroll: (state, { payload: { user, course } }) => {
      const newEnrollment = {
        _id: uuidv4(),
        user: user._id,
        course: course._id || course  // Handle both course object and course ID
      };
      state.enrollments = [...state.enrollments, newEnrollment];
      // Check if we're on the client side before using sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('enrollments', JSON.stringify(state.enrollments));
      }
    },
    unenroll: (state, { payload: { user, course } }) => {
      state.enrollments = state.enrollments.filter((e: { user: any; course: any }) =>
        !(e.course === (course._id || course) && e.user === user._id)
      );
      // Check if we're on the client side before using sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('enrollments', JSON.stringify(state.enrollments));
      }
      console.log("After unenroll:", JSON.stringify(state.enrollments, null, 2));
    },
  },
});

export const { 
  addCourse, 
  deleteCourse, 
  updateCourse, 
  editCourse, 
  enroll, 
  unenroll, 
  setCourses,
  setEnrollments  // ADD THIS EXPORT
} = coursesSlice.actions;

export default coursesSlice.reducer;