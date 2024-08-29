// Imports
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "./config.js";


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
                message: "Request body missing fields"
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
 * Response: username, userId, and token, or an error message
 */
AuthRouter.post("/login", async (req, res) => {

    try {

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
        
        // Send user information and token
        const userInfo = {
            username: user.username,
            userId: user._id,
            token: jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' })
        }
        return res.status(200).send(userInfo);

    } catch(error) {
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

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(204).send();

        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).send({userId: decoded.userId, username: decoded.username});

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
    
});


export default AuthRouter;