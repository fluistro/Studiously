const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo");

const AuthRouter = require("./routes/auth");

const app = express();
const Store = mongoStore(session);

app.use(express.json());
app.use(session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new Store({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: parseInt(process.env.SESSION_LIFETIME) / 1000
    }),
    cookie: {
        sameSite: true,
        secure: NODE_ENV === 'production',
        maxAge: parseInt(process.env.SESSION_LIFETIME)
    }
}));

const apiRouter = express.Router();
apiRouter.use("/auth", AuthRouter);

app.use("/api", apiRouter);