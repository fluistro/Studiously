import express from "express";
import UserAuth from "../models/userAuth.js";

const AuthRouter = express.Router();

// Sign up 
// Does not automatically login, just updates DB
AuthRouter.post("/signup", async (req, res) => {

    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Missing username or password");
        }

        // Add username/password validation here

        const newUser = new UserAuth({ username, password });
        await newUser.save();
        res.send({ user_id: newUser.id, username });

    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
    
});

// Login, create user session
AuthRouter.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Missing username or password");
        }

        const user = await UserAuth.findOne({ username });
        if (!user) throw new Error("Username not found");
        if (!user.passwordMatches(password)) throw new Error("Incorrect password");

        if (req.session.user) throw new Error("User session already exists");
        const userInfo = {
            username: user.username,
            user_id: user.id
        }
        req.session.user = userInfo;
        res.send(userInfo);

    } catch(err) {
        res.status(400).send(err);
    }

});

// Logout, delete current user session
AuthRouter.delete("/logout", (req, res) => {
    const session = req.session;
    try {
        const user = session.user;
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
AuthRouter.get("/", ({ session: { user }}, res) => {
    if (user) res.send(user);
    else res.send({user: "test"});
});

export default AuthRouter;