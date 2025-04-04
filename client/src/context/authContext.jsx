import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(null);

    // Load user from localStorage on initial render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token); // Decode the token
                setCurrUser(decodedUser); // Set the decoded user
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token"); // Remove invalid token
            }
        }
    }, []);

    // Function to update user and store token
    const updateUser = (data) => {
        const { token } = data; // Extract token from response
        if (token) {
            localStorage.setItem("token", token); // Save token to localStorage
            const decodedUser = jwtDecode(token); // Decode the token
            setCurrUser(decodedUser); // Update user state
        }
    };

    // Logout function to clear user and token
    const logout = () => {
        setCurrUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ currUser, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};