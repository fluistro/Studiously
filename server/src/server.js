// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Environment variables
import { PORT, MONGO_URI } from "./config.js";

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
            origin: 'http://localhost:3000',
            credentials: true
        }));
        app.use(express.json());
    
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