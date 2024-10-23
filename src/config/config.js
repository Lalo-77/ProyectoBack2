import dotenv from "dotenv"; 

dotenv.config(); 

export default {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || "coderhouse",
    sessionSecret: process.env.SESSION_SECRET || "coderhouse",
    port: process.env.PORT || 8080
};
