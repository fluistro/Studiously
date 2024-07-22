// Imports
import express from "express";
import User from "../models/User.js";

const AuthRouter = express.Router();

// Sign up, update MongoDB
AuthRouter.post("/signup", async (req, res) => {

    try {

        // Username and password validation
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Missing username or password");
        }

        // Add more validation here


        // Check if username is taken
        const user = await User.findOne({ username });
        if (user) throw new Error("Username already taken");

        // Save new user to MongoDB
        const newUser = new User({ username, password });
        await newUser.save();

        // Send id and username as response
        res.send({ user_id: newUser.id, username });

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }
    
});

// Login, create user session
AuthRouter.post("/login", async (req, res) => {

    try {

        // Check if a user is already logged in
        if (req.session.user) throw new Error("User session already exists");

        // Username and password validation
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Missing username or password");
        }

        // Search for username and password in MongoDB
        const user = await User.findOne({ username });
        if (!user) throw new Error("Username not found");
        if (!user.passwordMatches(password)) throw new Error("Incorrect password");
        
        // Send user information and update session
        const userInfo = {
            username: user.username,
            user_id: user._id
        }
        req.session.user = userInfo;
        res.send(req.session.user);

    } catch(error) {
        res.status(400).send({
            "error": error.message
        });
    }

});

// Logout, delete current user session 
AuthRouter.delete("/logout", (req, res) => {

    const session = req.session;

    try {

        const user = session.user; // To send back

        // Destroy current user session
        session.destroy(err => {
            if (err) throw (err);
            res.clearCookie(process.env.SESSION_NAME);
            res.send(user);
        });

    } catch (err) {
        res.status(422).send(err);
    }

});

// Respond with username and user_id if logged in, and undefined if not
AuthRouter.get("/", (req, res) => {
    //console.log(req.session);
    const user = req.session.user;
    if (user) res.send(user);
    else res.send({user: undefined});
});

export default AuthRouter;