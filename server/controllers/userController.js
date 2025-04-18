import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, phoneNo, isAdmin = false, location, ward, zone } = req.body;


    //validate
    if (!name || !password || !phoneNo) {
        return res.status(400).json({ msg: "All required fields must be provided" });
    }

    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists with this email" });
    }

    //validate location
    if (!location || location.type !== "Point" || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return res.status(400).json({ msg: "Invalid location format. Expected { type: 'Point', coordinates: [longitude, latitude] }" });
    }

    //hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    try {
        
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            phoneNo,
            isAdmin,
            location,
            ward,
            zone
        });

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ msg: "Failed to create user", error: error.message });
    }
};

export const login = async (req, res) => {
    const { phoneNo, password } = req.body;

    try {
        //check if user exists in the database
        const user = await User.findOne({ phoneNo: Number(phoneNo) });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        //compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: user.name, isAdmin: user.isAdmin, isWC: user.isWC ,userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token to the client
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000)
        });

        return res.status(200).json({ msg: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ msg: "Error during login", error: error.message });
    }
};