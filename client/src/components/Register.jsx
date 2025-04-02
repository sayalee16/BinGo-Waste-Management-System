import { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import GetUserLocation from "./GPSPermission";

const Register = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        
    }, []);
    const handleLogin = () => {
        if (!/^[0-9]{10}$/.test(phone)) {
            setError("Enter a valid 10-digit phone number");
            return;
        }
        if (password.trim() === "") {
            setError("Password cannot be empty");
            return;
        }
       
        setError("");
        setLoggedIn(true); // Simulate successful login
    };

    return (
        <div className="flex flex-row items-center justify-center h-screen bg-gray-100 ">
            <div className="w-96 p-6 shadow-lg rounded-2xl bg-white">
                <h2 className="text-xl font-bold text-center mb-4">
                    {loggedIn ? "Welcome!" : "Login"}
                </h2>

                {!loggedIn ? (
                    <>

                        {/* Name Input */}
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mb-3 border rounded-lg p-2 w-full"
                            required
                        />
                        {/* Phone Number Input */}
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mb-3 border rounded-lg p-2 w-full"
                            required
                        />
                        {/* Email Input */}
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-3 border rounded-lg p-2 w-full"
                        />
                         {/* Password Input */}
                         <input
                            type="password"
                            placeholder="Enter New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-3 border rounded-lg p-2 w-full"
                            required
                        />
              

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                        {/* Submit Button */}
                        <button
                            type="button"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-2"
                            onClick={handleLogin}
                        > Register </button>
                    </>
                ) : (
                    <p className="text-green-600 text-center">Account created! Ready to make a difference!?🌍</p>
                )}

            </div>
            
        </div>
    );
};

export default Register;
