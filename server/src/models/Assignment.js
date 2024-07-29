import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    // "complete", "in progress", "to do"
    status: {
        type: String,
        required: true,
    },

    due: Date,
    weight: Number,
    grade: Number,

});

CourseSchema.pre("save", function() {
    if (typeof this.status == "undefined") this.status = "to do";
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;