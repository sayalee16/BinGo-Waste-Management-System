import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const register = async (req,res) => {
    const {name, phone, email, password, isAdmin} = req.body;
    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);
    //create new user n save to db
      try {
        var user = await User.create({ name, phone, email, password: hashPassword ,isAdmin});

        res.status(201).json({ user });
      } catch (error) {
        res.status(500).json({ msg: "failed to create user" });
      }
    
}
export const login = async (req, res) => {
    const { phoneNo, password } = req.body;

    try {
        // Check if user exists in the DB
        const user = await User.findOne({ phoneNo: Number(phoneNo) });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        //Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
           return res.status(400).json({ msg: "Invalid credentials" });
        }
        

        // Generate JWT token
        const token = jwt.sign({ username: user.name,isAdmin: user.isAdmin , userId: user._id   }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Send token to the client
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000)
        });

        // console.log("user is");
        // console.log(user);
        // Send the JSON response
        return res.status(200).json({ msg: "Login successful", token ,user: user});

    } catch (error) {
        res.status(500).json({ msg: "Error during login", error: error.message });
    }

}
