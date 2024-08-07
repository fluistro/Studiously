// Imports
import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Course from "../models/Course.js";


const CourseRouter = express.Router();

// Middleware to ensure user is authenticated
CourseRouter.use((req, res, next) => {

    const currentUser = req.session.user;

    if (!currentUser) {
        return res.status(401).send({ 
            message: "Not currently logged in" 
        });
    } else {
        req.userId = currentUser.userId;
        next();
    }

});

/**
 * Get all courses for the current user.
 * 
 * Response: array of course objects.
 */
CourseRouter.get("/", async (req, res) => {

    try {
        
        // Get user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const courseIds = user.courses;
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

        const courseId = mongoose.Types.ObjectId(req.params.courseId);

        // Check that user exists and has the requested course
        
        const user = await User.findById(req.user_id);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        if (!user.courses.includes(courseId)) {
            return res.status(401).send({
                message: "Course not in user course list"
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
CourseRouter.post("/create", async (req, res) => {

    try {
        
        // Ensure the required info was sent
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                message: "Missing course name"
            });
        }

        // Get user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
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

        return res.status(201).send(newCourse._id);

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
CourseRouter.put("/edit/:courseId", async (req, res) => {

    try {

        const courseId = mongoose.Types.ObjectId(req.params.courseId);

        // Ensure user is authorized

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (!user.courses.includes(courseId)) {
            return res.status(401).send({
                message: "Course not found in user course list"
            });
        }

        // Validate body
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                message: "Missing course name"
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

        const courseId = mongoose.Types.ObjectId(req.params.courseId);

        // Remove course from user's course array
        const updateInfo = await User.updateOne(
            { _id: req.userId },
            { $pull: { courses: courseId } }
        );
        if (updateInfo.matchedCount === 0) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        if (updateInfo.modifiedCount === 0) {
            return res.status(401).send({
                message: "Course does not belong to user"
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