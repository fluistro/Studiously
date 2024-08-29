// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

// Environment variables
import { PORT, NODE_ENV, MONGO_URI, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME } from "./config.js";

// Routers
import AuthRouter from "./routes/auth.js";
import CourseRouter from "./routes/courses.js";
import AssignmentRouter from "./routes/assignments.js";

(async () => {
    try {

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    
        // Initialize express app
        const app = express();
        app.disable('x-powered-by');
        app.use(cors({
            origin: 'https://studiously-brown.vercel.app',
            credentials: true
        }));
        app.use(express.json());

        // Use user session for authentication
        app.use(session({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            store: MongoStore.create({
                mongoUrl: MONGO_URI,
                dbName: "session",
                ttl: SESSION_LIFETIME / 1000
            }),
            cookie: {
                sameSite: 'lax',// 'none',
                secure: false, // NODE_ENV === "production",
                maxAge: parseInt(SESSION_LIFETIME)
            }
        }));
    
        // Connect routers and begin listening
        const apiRouter = express.Router();
        apiRouter.use("/auth", AuthRouter);
        apiRouter.use("/courses", CourseRouter);
        apiRouter.use("/assignments", AssignmentRouter);

        app.use("/api", apiRouter);
    
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    
    } catch(err) {
        console.log(err);
    }    
})();