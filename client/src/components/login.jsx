import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  //for toggle animation
  const [isSignIn, setIsSignIn] = useState(true);

  //login fields
  const [oldUser, setOldUser] = useState({
    phone : "",
    password : "",
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);

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

    useEffect(() => {
          if (!navigator.geolocation) {
              setError("Geolocation is not supported by your browser.");
              return;
          }
  
          const watchId = navigator.geolocation.watchPosition(
              (position) => {
                  setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                  });
                  setError(""); // Clear any previous errors
              },
              (err) => {
                  // setError("Permission denied or error getting location.");
                  // console.error("Error getting location:", err);
              }
          );
          
          return () => navigator.geolocation.clearWatch(watchId);
      }, []);

      useEffect(() => {
        if (location) {
            console.log("Updated location:", location);
        }
    }, [location]); 

  const onHandleLogin = async(e) => {
    e.preventDefault(); // Prevents form from reloading the page
    if (!/^[0-9]{10}$/.test(oldUser.phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    
    if (oldUser.password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }
    if (oldUser.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    //destucturing
    const {phone, password} = oldUser;
    if(phone && password){
        let endpoint = "login";
        // try {
        //     const res = await fetch(`http://localhost:5000/${endpoint}`, {phone, password})
        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("user", JSON.stringify(res.data.user));
        // } catch (error) { setError(error.response?.data?.error);
        // }
        const res = await fetch(`http://localhost:5000/api/users/login`, 
          {phone, password},
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone,
              password,
          })
          }
  
        );
        if (res) {
          setOldUser({
            phone: "",
            password: ""
            
        })
        console.log(res);
        alert("DATA STORED");
    }
  }
    

    setError("");
    setLoggedIn(true);
  };

  const onHandleSignIn = async() => {
    if (!/^[0-9]{10}$/.test(newUser.phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setError("Enter a valid email address");
      return;
    }
    if (newUser.password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }
    if (newUser.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const {name, phone, email, password} = newUser;
    if(name && phone && email && password){
        // try {
        //     const res = await fetch(`http://localhost:5000/${endpoint}`, {phone, password})
        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("user", JSON.stringify(res.data.user));
        // } catch (error) { setError(error.response?.data?.error);
        // }
        const res = await fetch(`http://localhost:5000/api/users/register`, 
          {name, phone, email, password},
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
              email,
              password,
          })
          }
  
        );
        if (res) {
          setNewUser({
            name:"",
            phone: "",
            email:"",
            password: ""
            
        })
        console.log(res);
        alert("DATA STORED");
    }
  }
    
    setError("");
    setRegisteredIn(true);
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
