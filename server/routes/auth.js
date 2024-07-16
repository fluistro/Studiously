const express = require("express");
const UserAuth = require("../models/userAuth");

const AuthRouter = express.Router();


// Note that signing up does not automatically login
AuthRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Missing username or password");
    }
    const newUser = new UserAuth({ username, password });
    await newUser.save();
    res.send({ user_id: newUser.id });
});


AuthRouter.post("/login", async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Missing username or password");
    }

    const user = await UserAuth.findOne({ username });
    if (!user) res.status(400).send("Username not found");
    if (!user.passwordMatches(password)) res.status(400).send("Incorrect password");

    const userInfo = {
        username: user.username,
        user_id: user.id
    }
    req.session.user = userInfo;
    res.send(userInfo);

});


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
    res.send(user);
});

export default AuthRouter;