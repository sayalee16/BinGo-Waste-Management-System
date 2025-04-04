import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserMainNavigation from './userMainNavigation';
import AdminMainNavigation from './AdminMainNavigation';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext'; // Importing AuthContext for user authentication

const Login = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  //for toggle animation
  const [isSignIn, setIsSignIn] = useState(true);
  const { updateUser} = useContext(AuthContext);

  //login fields
  const [oldUser, setOldUser] = useState({
    phone : "",
    password : "",
  });

  const [loggedIn, setLoggedIn] = useState(false);

  //registration fields
  const [newUser, setNewUser] = useState({
    name : "",
    phone : "",
    password : "",
    email : "",
  });

  const [error, setError] = useState("");
  const [registerdIn, setRegisteredIn] = useState(false);

  const toggleForm = () => setIsSignIn(!isSignIn);

    const onHandleLogin = async (e) => {
      e.preventDefault();
      // Validate phone
      if (!/^[0-9]{10}$/.test(oldUser.phone)) {
        setError("Enter a valid 10-digit phone number");
        return;
      }
      
      // Validate password
      if (oldUser.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
  
      const { phone, password } = oldUser; 
  
      try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login` ,
           {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                phoneNo: phone,  // Change "phone" to "phoneNo" to match backend
                password: password
              }),
          });
  
          const data = await res.json(); // Convert response to JSON
          console.log("Server Response:", data); // Debugging
  
          if (!res.ok) {
              setError(data.msg || "Invalid credentials"); // Show error from backend
              return;
          }
  
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
  
          // Clear state and show success message
          setOldUser({ phone: "", password: "" });
          setError("");
          setLoggedIn(true);
          alert("Login successful!");
          updateUser(data.token);
          if (data.user.isAdmin) {
            navigate("/AdminMainNavigation"); // Redirect to admin Main page
          } else {
            navigate("/userMainNavigation"); // Redirect to user Main page
          }
      } catch (error) {
          console.error("Login error:", error);
          setError("Something went wrong. Please try again.");
      }
  };
  

  const onHandleSignIn = async () => {

    if (!/^[0-9]{10}$/.test(newUser.phone)) {
        setError("Enter a valid 10-digit phone number");
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
        setError("Enter a valid email address");
        return;
    }
    
    if (newUser.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }
  
    const { name, phone, email, password } = newUser;

    const userLocation = {
        type: "Point",
        coordinates: [18.0594, 173.065], // Default coordinates (0, 0) if not provided
    };
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newUser.name.trim(),
              phoneNo: newUser.phone.trim(),  // Ensure this matches the backend field
              email: newUser.email.trim(),
              password: newUser.password,
                isAdmin: false,
                location: userLocation,
                ward: "xyz ward",
                zone: "xyz zone",
            }),
        });

        const data = await res.json();
        console.log("Register Response:", data); // Debugging

        if (!res.ok) {
            setError(data.msg || "Failed to register user");
            return;
        }

        // Clear form & show success
        setNewUser({ name: "", phone: "", email: "", password: "" });
        setError("");
        setRegisteredIn(true);
        alert("Registration successful!");
    } catch (error) {
        console.error("Registration error:", error);
        setError("Something went wrong. Please try again.");
    }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Expanding Background */}
      
      <div className={`absolute top-0 right-0 h-screen w-[200vw] md:w-[300vw] overflow-hidden bg-gradient-to-br from-[#4EA685] to-[#57B894] shadow-xl transition-all duration-500 ease-in-out rounded-br-[max(60vw,60vh)] rounded-tl-[max(60vw,60vh)] flex items-center justify-center text-white
  ${isSignIn ? 'translate-x-0 right-1/2 ' : 'translate-x-full right-1/2'}` }/>
    
      <div className='flex flex-column absolute top-0 left-0 w-full h-full items-center pr-20 pb-70 justify-center'>  

        <h1 className={` hidden sm:block text-white font-bold z-20 transition-all duration-500 ease-in-out  ${isSignIn ? 'sm-opacity-100 text-2xl sm:text-6xl ' : 'opacity-0 -translate-x-full'}`}>Welcome Back!</h1>


      {/* Authentication Forms */}
      <div className="relative z-10 flex text-center flex-wrap w-full sm:w-3/4 md:w-1/2 h-auto p-6  sm:p-8">
      
          {/* Login Form */}
          <div className={`absolute w-full sm:w-3/4 md:w-1/2  items-center p-6 transition-all duration-500 ease-in-out ${
            isSignIn ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            }`}>
              <h1 className={`sm:hidden text-white font-bold z-20 transition-all  duration-500 ease-in-out text-4xl  [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] pb-10 `}>Welcome Back!</h1>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold text-center mb-4">Login</h2>
              <input 
                type="tel" 
                placeholder="Enter Phone Number" 
                value={oldUser.phone} 
                onChange={(e) => setOldUser({ ...oldUser, phone: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg"
                required  
              />
              <input 
                type="password" 
                placeholder="Enter Password" 
                value={oldUser.password} 
                onChange={(e) => setOldUser({ ...oldUser, password: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg"
                required
                />
            
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button onClick={onHandleLogin} className="w-full p-3 bg-[#4EA685] text-white rounded-lg">Login</button>
              <p className="text-center mt-3">Don't have an account? <span onClick={toggleForm} className="text-blue-500 cursor-pointer">Sign up</span></p>
            </div>
          </div>

        {/* Sign Up Form */}
          <div className={`absolute w-full sm:w-3/4 md:w-1/2  transition-all duration-500 ease-in-out ${
            isSignIn ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
          }`}>
            <h1 className={`sm:hidden text-white font-bold z-20 transition-all  duration-500 ease-in-out text-4xl  [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] pb-10 `}>Join With Us</h1>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold text-center mb-4">Register</h2>
              <input 
                type="text" 
                placeholder="Enter Name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg" 
                required />
              <input 
                type="tel" 
                placeholder="Enter Phone Number" 
                value={newUser.phone} 
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg" 
                required />
              <input 
                type="email" 
                placeholder="Enter Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg" />
              <input 
                type="password" 
                placeholder="Enter Password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                className="w-full p-3 mb-3 border rounded-lg" 
                required />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button onClick={onHandleSignIn} className="w-full p-3 bg-[#4EA685] text-white rounded-lg">Register</button>

              <p className="text-center mt-3">Already have an account? <span onClick={toggleForm} className="text-blue-500 cursor-pointer">Sign in</span></p>
          </div>
        </div>
      </div>
    </div>

    <h1 className={`text-white hidden sm:block font-bold z-20 transition-all duration-500 ease-in-out ${isSignIn ? 'opacity-0 -translate-x-full' : 'text-4xl sm:text-6xl translate-x-95 opacity-100'}`}>Join With Us!</h1>

    </div>
  );
};

export default Login;
