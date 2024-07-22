// Imports
import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";

const CourseRouter = express.Router();

// Get all courses for a user
CourseRouter.get("/", (req, res) => {

});

// Get specific course
CourseRouter.get("/:id", (req, res) => {

});

// Create course
CourseRouter.post("/create", (req, res) => {

});

// Edit course
CourseRouter.put("/edit/:id", (req, res) => {

});

// Delete course
CourseRouter.delete("/:id", (req, res) => {

});

export default CourseRouter;