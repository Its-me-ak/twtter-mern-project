import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.JWT;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decodedToken){
            return res.status(403).json({ error: 'Unauthorized: Invalid token' });
        }
        const user = await UserModel.findById(decodedToken.userId).
        select("-password")
        if (!user) {
            return res.status(404).json({ error: 'Unauthorized: User not found' });
        }
        // console.log(user);
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protected route:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}