import UserModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body

        // Basic validation
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and 8 characters long',
            });
        }

        // Check for existing user
        const existingUser = await UserModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email is already registered' });
            }
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
            await newUser.save()
            generateTokenAndSetCookie(newUser._id, res)
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
            res.status(400).json({ error: 'Failed to create user' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username && !email) {
            return res.status(400).json({ error: 'Please provide either username or email' })
        }
        const user = await UserModel.findOne({
            $or: [
                { username },
                { email: { $regex: new RegExp(`^${username}$`, 'i') } },
            ]
        })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Password is incorrect' })
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
        res.status(500).json({ error: 'Internal Server Error', error })
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
        res.status(500).json({ error: 'Internal Server Error' })
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
        res.status(500).json({ error: 'Internal Server Error' })
    }
}