import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Correct import

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedUser.exp && decodedUser.exp < currentTime) {
                    console.warn("Token has expired");
                    localStorage.removeItem("token");
                    return null;
                }
                return decodedUser;
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
            }
        }
        return null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedUser.exp && decodedUser.exp < currentTime) {
                    console.warn("Token has expired");
                    localStorage.removeItem("token");
                    return;
                }
                setCurrUser(decodedUser);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const updateUser = (data) => {
        const { token } = data;
        if (token) {
            try {
                localStorage.setItem("token", token);
                const decodedUser = jwtDecode(token);
                setCurrUser(decodedUser);
            } catch (error) {
                console.error("Failed to decode token:", error);
                localStorage.removeItem("token");
            }
        }
    };

    const logout = () => {
        setCurrUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ currUser, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};