// Imports
import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";

const AssignmentRouter = express.Router();

// Middleware to ensure user is authenticated
AssignmentRouter.use((req, res, next) => {

    const currentUser = req.session.user;

    if (!currentUser) {
        res.status(400).send({ "error": "Not currently logged in" })
    } else {
        req.user_id = currentUser.user_id;
        next();
    }

});

// Get all assignment ids for a user
// Return an object { course_id: [assignment_ids], ... }
AssignmentRouter.get("/", async (req, res) => {

    try {
        
        // Get user
        const user = await User.findById(req.user_id);
        if (!user) throw new Error("User not found");

        let courses = user.courses;
        let result = {};

        for (let i = 0; i < courses.length; i++) {
            const courseInfo = await Course.findById(courses[i]);
            if (!courseInfo) throw new Error(`Course id not found: ${courses[i]}`);

            result.push(courseInfo);
        }

        res.send(result);

    } catch (error) {
        res.status(400).send({
            "error": error.message
        });
    }

});