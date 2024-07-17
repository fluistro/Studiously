export const {
    PORT = 5000,
    NODE_ENV = "dev",
    MONGO_URI = "",

    SESSION_NAME = "session",
    SESSION_SECRET = "secret",
    SESSION_LIFETIME = 1000 * 60 * 60 * 24,
} = process.env;