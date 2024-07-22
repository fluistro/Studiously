import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    grade: Number,
    manuallyEnterGrade: Boolean,

    // Array of assignment ids
    assignments: [mongoose.SchemaTypes.ObjectId]

});

const Course = mongoose.model('User', CourseSchema);
export default Course;