import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    grade: Number,
    manuallyEnterGrade: {
        type: Boolean,
        required: true,
    },

    // Array of assignment ids
    assignments: [String]

});

const Course = mongoose.model('User', CourseSchema);
export default Course;