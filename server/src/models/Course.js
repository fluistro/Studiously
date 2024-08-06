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
    assignments: [mongoose.SchemaTypes.ObjectId]

});

// Make empty courses array if none exists
CourseSchema.pre("save", function() {
    if (typeof this.assignments == "undefined") this.assignments = [];
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;