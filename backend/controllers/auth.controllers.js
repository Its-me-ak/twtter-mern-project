import UserModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body

        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const existingEmail = await UserModel.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({
            fullName,
            username,
            email,
            password: hashedPassword
        })
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg

            })
        } else {
            res.status(400).json({ message: 'Failed to create user' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const login = async (req, res) => {
    res.json({
        message: 'User logged in successfully'
    })
}

export const logout = async (req, res) => {
    res.json({
        message: 'User logged out successfully'
    })
}