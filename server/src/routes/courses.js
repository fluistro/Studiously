// Imports
import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";

const CourseRouter = express.Router();

// Middleware to ensure user is authenticated
CourseRouter.use((req, res, next) => {

    const currentUser = req.session.user;

    if (!currentUser) {
        res.status(400).send({ "error": "Not currently logged in" })
    } else {
        req.user_id = currentUser.user_id;
        next();
    }

});

// Get all courses for a user
CourseRouter.get("/", async (req, res) => {

    try {
        
        // Get user
        const user = await User.findById(req.user_id);
        if (!user) throw new Error("User not found");

        let courses = user.courses;
        let result = [];

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

// Get specific course
CourseRouter.get("/:id", async (req, res) => {

    try {

        const courseId = req.params.id;
        const user = await User.findById(req.user_id);

        // Check that user exists and has the requested course
        if (!user) throw new Error("User not found");
        if (!user.courses.includes(courseId)) throw new Error("Course not found in user course list");

        // Get course information
        const course = await Course.findById(courseId);
        if (!course) throw new Error("Course id not found");
        res.send(course);

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }
    
});

// Create course, only require name and manuallyEnterGrade
CourseRouter.post("/create", async (req, res) => {

    try {
        
        // Validate body
        const { name, manuallyEnterGrade } = req.body;
        if ((typeof name === "undefined") || (typeof manuallyEnterGrade === "undefined")) {
            throw new Error("Request body missing field");
        }

        // Create new course
        const newCourse = new Course({ name, manuallyEnterGrade });

        // Update user
        const updateInfo = await User.updateOne(
            { _id: req.user_id },
            { $push: { courses: newCourse._id } }
        );
        if (updateInfo.matchedCount === 0) throw new Error("User not found");

        // Save new course
        newCourse.save();
        res.send(newCourse);

    } catch (error) {
        res.status(400).send({
            "error": error.message
        });
    }

});

// Edit course
CourseRouter.put("/edit/:id", async (req, res) => {

    try {

        // Validate body
        const { name, grade, manuallyEnterGrade } = req.body;
        if ((typeof name === "undefined") || (typeof manuallyEnterGrade === "undefined")) {
            throw new Error("Request body missing field");
        }

        const courseId = req.params.id;
        const user = await User.findById(req.user_id);

        // Check that user exists and has the requested course
        if (!user) throw new Error("User not found");
        if (!user.courses.includes(courseId)) throw new Error("Course not found in user course list");

        // Update course
        const updateInfo = await Course.updateOne(
            { _id: courseId },
            { name, grade, manuallyEnterGrade }
        );
        if (updateInfo.matchedCount === 0) throw new Error("Course not found");

        res.send(updateInfo);

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }

});

// Delete course
CourseRouter.delete("/:id", async (req, res) => {

    try {

        const courseId = req.params.id;

        // Remove course from user's course array
        const updateInfo = await User.updateOne(
            { _id: req.user_id },
            { $pull: { courses: courseId } }
        );
        if (updateInfo.matchedCount === 0) throw new Error("User not found");
        if (updateInfo.modifiedCount === 0) throw new Error("Course not found in user course list");

        // Delete from Courses collection
        const deleteInfo = await Course.deleteOne({_id: courseId});
        if (deleteInfo.deletedCount !== 1) throw new Error("Course id not found");

        res.send({ ...updateInfo, ...deleteInfo });

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }

});

export default CourseRouter;