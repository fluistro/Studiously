import mongoose from "mongoose";


const AssignmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    isCompleted: {
        type: Boolean,
        required: true,
    },

    dueDate: {
        type: Date,
        required: true,
    },

    dateCreated: {
        type: Date,
        required: true,
    },

    weight: Number, // 0-100
    grade: Number, // 0-100

});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;