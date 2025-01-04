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
    try {
        const { username, email, password } = req.body
        if (!username && !email) {
            return res.status(400).json({ message: 'Please provide either username or email' })
        }
        const user = await UserModel.findOne({
            $or: [{ username }, { email }]
        })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password is incorrect' })
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            message: 'User login successfully',
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
            },
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('JWT', '', { maxAge: 0 })
       return res
            .status(200)
            .json({ message: 'User logged out successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select("-password")
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.error("Error while getting user", error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}