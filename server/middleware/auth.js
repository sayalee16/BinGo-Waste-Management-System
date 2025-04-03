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

export const authenticateAdmin = async (req, res, next) => {  
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
        console.log(decoded);
        if (!decoded.isAdmin) {  
            return res.status(403).json({  
                status: "error",  
                message: "Access denied. Admins only.",  
            });  
        }  

        req.userId = decoded.userId;  
        req.role = decoded.role;  
        req.isAdmin = decoded.isAdmin;  
        next();  
    } catch (error) {  
        res.status(401).json({  
            status: "error",  
            message: "Token is not valid",  
        });  
    }  
};


export const authenticateWC = async (req, res, next) => {  
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
        console.log(decoded);
        if (!decoded.isWC) {  
            return res.status(403).json({  
                status: "error",  
                message: "Access denied. WC only.",  
            });  
        }  

        req.userId = decoded.userId;  
        req.role = decoded.role;  
        req.isWC = decoded.isWC;  
        next();  
    } catch (error) {  
        res.status(401).json({  
            status: "error",  
            message: "Token is not valid",  
        });  
    }  
};
