import mongoose from "mongoose";


const CourseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    // Array of assignment ids
    assignments: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true,
    },

    // Date created
    dateCreated: {
        type: Date,
        required: true,
    },

});

const Course = mongoose.model('Course', CourseSchema);
export default Course;