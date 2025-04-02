import jwt from "jsonwebtoken";  
import dotenv from "dotenv";  

dotenv.config();  

export const authenticateUser = async (req, res, next) => {  
    const bearer = req.headers.authorization;  
    if (!bearer) {  
        return res.status(401).json({  
            status: "error",  
            message: "No token, authorization denied",  
        });  
    }  

    const token = bearer.split(" ")[1];  
    if (!token) {  
        return res.status(401).json({  
            status: "error",  
            message: "No token, authorization denied",  
        });  
    }  

    try {  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        req.userId = decoded.userId;  
        req.role = decoded.role;  
        req.isAdmin = decoded.isAdmin;  //correct
        next();  
    } catch (error) {  
        res.status(401).json({  
            status: "error",  
            message: "Token is not valid",  
        });  
    }  
};
