import React, { useState } from "react";
import 'font-awesome/css/font-awesome.min.css';
import Auth from "../service/Auth.js";
import { motion } from 'framer-motion'; // Importing Framer Motion for animations
import { useAuth } from '../providers/AuthContext'; 

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profil, setProfil] = useState({ username: "", password: "", role: "Select Role" });
  const [message, setMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const auth = new Auth(); 
  const { user } = useAuth();

  // Remove the role restriction logic here
  const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"];

  const handleRegister = async () => {
    if (!user || !user._id) {
      setMessage("User ID is not available. Please try again.");
      setIsModalOpen(true);
      return;
    }
  
    try {
      if (profil.role === "Select Role") {
        setMessage("Please select a role.");
        setIsModalOpen(true);
        return;
      }
  
      const updatedProfil = {
        ...profil,
        id: user._id
      };
  
      const response = await auth.registerUser(updatedProfil);
  
      if (response.status === 201) {
        setMessage("User registered successfully!");
      } else {
        setMessage(response.message || "Error occurred.");
      }
      setIsModalOpen(true);
    } catch (error) {
      setMessage("Error registering user. Please try again.");
      console.error(error);
      setIsModalOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfil((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setProfil({ username: "", password: "", role: "Select Role" });
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <motion.div
      className="flex justify-center items-center h-screen w-full p-6 sm:p-8"
      initial={{ opacity: 0, y: -50 }}  // Add animations for entering the form
      animate={{ opacity: 1, y: 0 }}   // Fade-in and slide-down effect
      transition={{ duration: 0.5 }}
    >
      <motion.div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg"
        whileHover={{ scale: 1.02 }}  // Slight scale-up on hover
      > 
        <header className="bg-[#242424] text-white w-full py-4 text-center">
          <h1 className="text-3xl font-bold">Register User</h1>
        </header>
        <div className="w-full p-6">
          <form>
            {/* Username Input */}
            <motion.div className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <div className="flex items-center border border-black rounded">
                <img
                  src="/images/account-circle.svg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full p-2"
                />
                <input
                  className="ml-2 w-full py-2 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={profil.username}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <div className="flex items-center border border-black rounded">
                <img
                  src="/images/lock.png"
                  alt="Lock"
                  className="w-10 h-10 rounded-full p-2"
                />
                <input
                  className="ml-2 w-full py-2 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={profil.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-xl`} aria-hidden="true"></i>
                </button>
              </div>
            </motion.div>

            {/* Role Dropdown */}
            <motion.div className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-black rounded p-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
                  name="role"
                  value={profil.role}
                  onChange={handleChange}
                >
                  <option value="Select Role">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <i className="fa fa-caret-down text-gray-400" aria-hidden="true"></i>
                </span>
              </div>
            </motion.div>

            {/* Register and Reset Buttons */}
            <div className="flex flex-col space-y-2">
              <motion.button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none"
                type="button"
                onClick={handleRegister}
                whileTap={{ scale: 0.95 }} // Shrink animation when clicked
              >
                REGISTER USER
              </motion.button>
              <motion.button
                className="border border-black hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full focus:outline-none"
                type="button"
                onClick={handleReset}
                whileTap={{ scale: 0.95 }} // Shrink animation when clicked
              >
                RESET
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Modal for showing messages */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-5 rounded shadow-md max-w-xs w-full mx-4">
            <h2 className="text-lg font-bold mb-4">{message}</h2>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none w-full"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RegisterForm;
