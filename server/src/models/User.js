// Imports
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { hashSync, compareSync } = bcrypt;

// Error messages
export const errors = {
    USER_NOT_FOUND: "user not found",
    PASSWORD_INCORRECT: "password is incorrect",
}

// Schema
const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    // Encrypted
    password: {
        type: String,
        required: true,
    },

    // Array of course ids
    courses: [mongoose.SchemaTypes.ObjectId],

});

// Encrypt password before saving
UserSchema.pre("save", async function() {
    if (this.isModified("password")) this.password = hashSync(this.password, 10);
});

// Return true if plaintext password is correct
UserSchema.methods.passwordMatches = function(plain_pass) {
    return compareSync(plain_pass, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;