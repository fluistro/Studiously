// Imports
import express from "express";
import User from "../models/User.js";


const AuthRouter = express.Router();

/**
 * Sign up a new user. Does not perform validation.
 * 
 * Requires: username, (plaintext) password
 * Response: username and userId, or an error message
 */
AuthRouter.post("/signup", async (req, res) => {

    try {

        // Username and password validation
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({
                message: "Missing username or password"
            });
        }

        // Check if username is taken
        const user = await User.findOne({ username });
        if (user) {
            return res.status(409).send({
                message: "Username already taken"
            });
        }

        // Save new user to MongoDB
        const newUser = new User({ username, password, courses: [] });
        await newUser.save();

        // Send id and username as response
        return res.status(201).send({ userId: newUser.id, username });

    } catch(error) {
        return res.status(500).send({
            message: error.message
        });
    }
    
});

/**
 * Log in a user.
 * 
 * Requires: username, (plaintext) password
 * Response: username and userId, or an error message
 */
AuthRouter.post("/login", async (req, res) => {

    try {

        // Check if a user is already logged in
        if (req.session.user) {
            return res.status(409).send({
                message: "User session already exists"
            });
        }

        // Username and password validation
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({
                message: "Missing username or password"
            });
        }

        // Search for username and password in MongoDB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({
                message: "Username not found"
            });
        }
        if (!user.passwordMatches(password)) {
            return res.status(401).send({
                message: "Incorrect password"
            });
        }
        
        // Send user information and update session
        const userInfo = {
            username: user.username,
            userId: user._id
        }
        req.session.user = userInfo;
        return res.status(200).send(req.session.user);

    } catch(error) {
        return res.status(500).send({
            message: error.message
        });
    }

});

/**
 * Log out the current user.
 * 
 * Response: none
 */
AuthRouter.delete("/logout", (req, res) => {

    const session = req.session;

    try {

        const user = session.user;
        if (!user) {
            return res.status(204).send();
        }

        // Destroy current user session
        session.destroy(err => {
            if (err) throw (err);
            res.clearCookie(process.env.SESSION_NAME);
            return res.status(204).send();
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }

});

/**
 * Get the currently logged in user.
 * 
 * Response: either 200 with the username and user id, or 204 with no body.
 */
AuthRouter.get("/", (req, res) => {

    try {

        const user = req.session.user;

        if (user) return res.status(200).send(user);
        else return res.status(204).send();

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
    
});

export default AuthRouter;