// Imports
import express from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";


const AssignmentRouter = express.Router();

// Middleware to ensure user is authenticated
AssignmentRouter.use((req, res, next) => {

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
 * Get all assignments for the current user.
 * 
 * Response: array of assignment objects.
 */
AssignmentRouter.get("/", async (req, res) => {

    try {
        
        // Get user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Get all assignment ids

        const courseIds = user.courses;
        const courseInfo = await Course.find({ _id: { $in: courseIds } });
        
        if (courseInfo.length !== courseIds.length) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        let assignmentIds = [];
        for (let i = 0; i < courseInfo.length; i++) {
            assignmentIds.push(...courseInfo[i].assignments);
        }

        const assignments = await Assignment.find({ _id: { $in: assignmentIds }});
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

        // Get course
        const courseInfo = await Course.findById(req.params.courseId);
        if (!courseInfo) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        // Get assignments
        const assignmentIds = courseInfo.assignments;
        const assignments = await Assignment.find({_id: {$in: assignmentIds}});
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
AssignmentRouter.post("/create/:courseId", async (req, res) => {

    try {

        // Ensure the required info was sent
        const { name, dueDate, grade, weight } = req.body;
        if (!name || !dueDate) {
            return res.status(400).send({
                message: "Missing assignment name or due date"
            });
        }

        // Get user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Get course
        const courseInfo = await Course.findById(req.params.courseId);
        if (!courseInfo) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        // Ensure course id belongs to user
        if (!user.courses.includes(courseInfo._id)) {
            return res.status(401).send({
                message: "Course id does not belong to current user"
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
            { _id: req.params.courseId },
            { $push: { assignments: newAssignment._id } }
        );

        return res.status(201).send(newAssignment._id);

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
AssignmentRouter.put("/edit/:assignmentId", async (req, res) => {

    try {

        const assignmentId = mongoose.Types.ObjectId(req.params.assignmentId);

        // Ensure that the current user is authorized to edit this assignment

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Get all assignment ids

        const courseIds = user.courses;
        const courseInfo = await Course.find({ _id: { $in: courseIds } });
        
        if (courseInfo.length !== courseIds.length) {
            return res.status(404).send({
                message: "Course not found"
            });
        }

        let assignmentIds = [];
        for (let i = 0; i < courseInfo.length; i++) {
            assignmentIds.push(...courseInfo[i].assignments);
        }

        if (!assignmentIds.includes(assignmentId)) {
            return res.status(401).send({
                message: "Assignment id does not belong to current user"
            });
        }

        // Edit assignment

        const { name, dueDate, isCompleted, grade, weight } = req.body;
        if (!name || !dueDate || typeof isCompleted === "undefined") {
            return res.status(400).send({
                message: "Request body missing fields"
            });
        }

        const updateInfo = Assignment.updateOne(
            { _id: assignmentId },
            { name, dueDate, isCompleted, grade, weight }
        );
        if (updateInfo.matchedCount === 0) throw new Error("Assignment not found");

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
AssignmentRouter.delete("/delete/:courseId/:assignmentId", async (req, res) => {

    try {

        const courseId = mongoose.Types.ObjectId(req.params.courseId);
        const assignmentId = mongoose.Types.ObjectId(req.params.assignmentId);

        // Ensure that the current user is authorized to edit this course

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (!user.courses.includes(courseId)) {
            return res.status(401).send({
                message: "Course does not belong to user"
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
                message: "Assignment does not belong to course"
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