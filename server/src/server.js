import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";

import { PORT, NODE_ENV, MONGO_URI, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME } from "./config";
import AuthRouter from "./routes/auth";


try {

    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const app = express();
    const Store = connectMongo(session);

    app.disable('x-powered-by');
    app.use(express.json());
    app.use(session({
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new Store({
            mongooseConnection: mongoose.connection,
            collection: 'session',
            ttl: parseInt(SESSION_LIFETIME) / 1000
        }),
        cookie: {
            sameSite: true,
            secure: NODE_ENV === 'production',
            maxAge: parseInt(SESSION_LIFETIME)
        }
    }));

    const apiRouter = express.Router();
    apiRouter.use("/auth", AuthRouter);
    app.use("/api", apiRouter);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

} catch(err) {
    console.log(err);
}

