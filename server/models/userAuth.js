// Imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Error messages
export const errors = {
    USER_NOT_FOUND: "user not found",
    PASSWORD_INCORRECT: "password is incorrect",
}

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
    if (this.isModified("password")) this.password = bcrypt.hashSync(this.password, 10);
});

// Search for user given credentials
// Pre: user has username and password fields
UserAuthSchema.methods.passwordMatches = function(plain_pass) {
    return bcrypt.compareSync(plain_pass, this.password);
}

const UserAuth = mongoose.model('User', UserAuthSchema);
export default UserAuth;