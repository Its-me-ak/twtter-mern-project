import express from "express";
import path from "path"
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { app, server, io } from "./lib/utils/soket.js";

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve()

app.use(express.json(
    {
        limit: "5mb"
    }
));
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    })
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnect()
});

//  "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
// "start": "cross-env NODE_ENV=production node backend/server.js"
// "dev": "cross-env NODE_ENV=development nodemon backend/server.js",