// Imports
import mongoose from "mongoose";
import { hashSync, compareSync } from "bcryptjs";

// Error messages
export const errors = {
    USER_NOT_FOUND: "user not found",
    PASSWORD_INCORRECT: "password is incorrect",
}

// Schema
const UserAuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});

// Encrypt password before saving
UserAuthSchema.pre("save", async function() {
    if (this.isModified("password")) this.password = hashSync(this.password, 10);
});

// Return true if plaintext password is correct
UserAuthSchema.methods.passwordMatches = function(plain_pass) {
    return compareSync(plain_pass, this.password);
};

const UserAuth = mongoose.model('User', UserAuthSchema);
export default UserAuth;