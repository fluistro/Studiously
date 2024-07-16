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
UserAuthSchema.statics.findUser = async function(user) {
    const doc = this.findOne({ username: user.username });
    if (!doc) return errors.USER_NOT_FOUND;
    if (bcrypt.compareSync(user.password, doc.password)) {
        return doc._id;
    }
    return errors.PASSWORD_INCORRECT;
}

const UserAuth = mongoose.model('User', UserAuthSchema);
export default UserAuth;