// Imports
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Course from "../models/Course.js";
import { JWT_SECRET } from "../config.js";


const CourseRouter = express.Router();

// Middleware to ensure user is authenticated
CourseRouter.use(async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ 
            message: "Not currently logged in" 
        });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });
    }

    req.userId = userId;
    req.user = user;
    next();
    
});

/**
 * Get all courses for the current user.
 * 
 * Response: array of course objects.
 */
CourseRouter.get("/", async (req, res) => {

    try {

        const courseIds = req.user.courses;
        const courseInfo = await Course.find({ _id: { $in: courseIds } });
        
        if (courseInfo.length !== courseIds.length) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        return res.status(200).send(courseInfo);

    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});

/**
 * Get specific course for the current user.
 * 
 * Response: course object.
 */
CourseRouter.get("/:courseId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);

        // Check that user exists has the requested course
        if (!req.user.courses.includes(courseId)) {
            return res.status(404).send({
                message: "Course not found in user info"
            });
        }

        // Get course information
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        return res.status(200).send(course);

    } catch(error) {
        return res.status(500).send({
            message : error.message
        });
    }
    
});

/**
 * Create course.
 * 
 * Requires: name
 * Response: id of the newly created course.
 */
CourseRouter.post("/", async (req, res) => {

    try {
        
        // Ensure the required info was sent
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                message: "Request missing fields"
            });
        }

        // Create and save new course
        const newCourse = new Course({ name, assignments: [], dateCreated: new Date() });
        await newCourse.save();

        // Update user's assignment array
        await User.updateOne(
            { _id: req.userId },
            { $push: { courses: newCourse._id } }
        );

        return res.status(201).send({ courseId: newCourse._id });

    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});

/**
 * Edit course.
 * 
 * Requires: new course name.
 * Response: none.
 */
CourseRouter.put("/:courseId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);

        // Ensure user is authorized

        if (!req.user.courses.includes(courseId)) {
            return res.status(404).send({
                message: "Course not found in user info"
            });
        }

        // Validate body
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                message: "Request missing fields"
            });
        }

        // Update course
        const updateInfo = await Course.updateOne(
            { _id: courseId },
            { name }
        );
        if (updateInfo.matchedCount === 0) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        res.status(204).send();

    } catch(error) {
        return res.status(500).send({
            message : error.message
        });
    }

});

/**
 * Delete course.
 * 
 * Response: none
 */
CourseRouter.delete("/:courseId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);

        // Remove course from user's course array
        const updateInfo = await User.updateOne(
            { _id: req.userId },
            { $pull: { courses: courseId } }
        );
        if (updateInfo.modifiedCount === 0) {
            return res.status(404).send({
                message: "Course not found in user info"
            });
        }

        // Delete from Courses collection
        const deleteInfo = await Course.deleteOne({_id: courseId});
        if (deleteInfo.deletedCount !== 1) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        return res.status(204).send();

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }

});


export default CourseRouter;