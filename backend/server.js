import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import dbConnect from "./db/dbConnect.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnect()
});