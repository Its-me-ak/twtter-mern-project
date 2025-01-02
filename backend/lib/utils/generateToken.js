import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    })
    console.log(token);
    res.status(200)
    .cookie("JWT", token, options)
    .json({ message: "Token generated successfully" });
}