// Imports
import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";


const AssignmentRouter = express.Router();

// Middleware to ensure user is authenticated
AssignmentRouter.use(async (req, res, next) => {

    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(401).send({ 
            message: "Not currently logged in" 
        });
    }

    const user = await User.findById(currentUser.userId);
    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });
    }

    req.userId = currentUser.userId;
    req.user = user;
    next();

});

/**
 * Get all assignments for the current user.
 * 
 * Response: array of assignment objects.
 */
AssignmentRouter.get("/", async (req, res) => {

    try {

        // Get all course information
        const courseIds = req.user.courses;
        const courseInfo = await Course.find({ _id: { $in: courseIds } });
        if (courseInfo.length !== courseIds.length) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        // Get all assignment ids
        let assignmentIds = [];
        for (let i = 0; i < courseInfo.length; i++) {
            assignmentIds.push(...courseInfo[i].assignments);
        }

        // Get all assignment info
        const assignments = await Assignment.find({ _id: { $in: assignmentIds }});
        if (assignments.length !== assignmentIds.length) {
            return res.status(404).send({
                message: "Assignment not found"
            });
        }

        return res.status(200).send(assignments);

    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});


/**
 * Get all assignments for a specific course, given its id.
 * 
 * Response: array of assignment objects.
 */
AssignmentRouter.get("/:courseId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);

        // Ensure course belongs to user
        if (!req.user.courses.includes(courseId)) {
            return res.status(404).send({
                message: `Course not found in user info: ${courseId}`
            });
        }

        // Get course
        const courseInfo = await Course.findById(courseId);
        if (!courseInfo) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        // Get assignments
        const assignmentIds = courseInfo.assignments;
        const assignments = await Assignment.find({_id: {$in: assignmentIds}});
        if (assignments.length !== assignmentIds.length) {
            return res.status(404).send({
                message: "Assignment not found"
            });
        }

        res.status(200).send(assignments);

    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});


/**
 * Create an assignment for a course, given the course id.
 * 
 * Requires: assignment name, due date. Automatically sets date created and isCompleted (to false).
 *   - Optional: grade, weight
 * Response: the newly created assignment's id.
 */
AssignmentRouter.post("/:courseId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);

        // Ensure the required info was sent
        const { name, dueDate, grade, weight } = req.body;
        if (!name || !dueDate) {
            return res.status(400).send({
                message: "Request body missing fields"
            });
        }
        
        // Ensure course id belongs to user
        if (!req.user.courses.includes(courseId)) {
            return res.status(404).send({
                message: "Course not found in user info"
            });
        }

        // Get course
        const courseInfo = await Course.findById(courseId);
        if (!courseInfo) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        // Create and save new assignment
        const newAssignment = new Assignment({ 
            name, 
            dueDate, 
            dateCreated: new Date(),
            isCompleted: false,
            grade,
            weight
        });
        await newAssignment.save();

        // Update course's assignment array
        await Course.updateOne(
            { _id: courseId },
            { $push: { assignments: newAssignment._id } }
        );

        return res.status(201).send({ assignmentId: newAssignment._id });

    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});


/**
 * Edit an assignment, given the assignment id.
 * 
 * Requires: assignment name, due date, isCompleted.
 *   - Optional: grade, weight
 * Response: none
 */
AssignmentRouter.put("/:courseId/:assignmentId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);
        const assignmentId = new mongoose.Types.ObjectId(req.params.assignmentId);

        // Ensure request contains required fields
        const { name, dueDate, isCompleted, grade, weight } = req.body;
        if (!name || !dueDate || typeof isCompleted === "undefined") {
            return res.status(400).send({
                message: "Request body missing fields"
            });
        }

        // Ensure that the current user is authorized to edit this course and assignment

        if (!req.user.courses.includes(courseId)) {
            return res.status(404).send({
                message: "Course not found in user info"
            });
        }

        const courseInfo = await Course.findById(courseId);
        if (!courseInfo) {
            return res.status(404).send({
                message: "Course not found"
            });
        }
        if (!courseInfo.assignments.includes(assignmentId)) {
            return res.status(404).send({
                message: "Assignment not found in course info"
            });
        }

        // Edit assignment

        const updateInfo = Assignment.updateOne(
            { _id: assignmentId },
            { name, dueDate, isCompleted, grade, weight }
        );
        if (updateInfo.matchedCount === 0) {
            return res.status(404).send({
                message: "Assignment not found"
            });
        }

        res.status(204).send();
        
    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});


/**
 * Delete an assignment, given the course and assignment id.
 * 
 * Response: none
 */
AssignmentRouter.delete("/:courseId/:assignmentId", async (req, res) => {

    try {

        const courseId = new mongoose.Types.ObjectId(req.params.courseId);
        const assignmentId = new mongoose.Types.ObjectId(req.params.assignmentId);

        // Ensure that the current user is authorized to edit this course

        if (!req.user.courses.includes(courseId)) {
            return res.status(401).send({
                message: "Course not found in user info"
            });
        }

        // Remove assignment from course
        const updateInfo = await Course.updateOne(
            { _id: courseId },
            { $pull: { assignments: assignmentId } }
        );
        if (updateInfo.matchedCount === 0) {
            return res.status(404).send({
                message: "Course not found"
            });
        }
        if (updateInfo.modifiedCount === 0) {
            return res.status(401).send({
                message: "Assignment not found in course info"
            });
        }

        // Delete assignment
        const deleteInfo = Assignment.deleteOne(
            { _id: assignmentId }
        );
        if (deleteInfo.deletedCount !== 1) {
            return res.status(404).send({
                message: "Assignment not found"
            });
        }

        return res.status(204).send();
        
    } catch (error) {
        return res.status(500).send({
            message : error.message
        });
    }

});


export default AssignmentRouter;