import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    })
    console.log("Generated token", token);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 86400000, // 1 day in milliseconds
    };
    res.status(201)
    .cookie("JWT", token, options)
    .json({ message: "Token generated successfully" });
}