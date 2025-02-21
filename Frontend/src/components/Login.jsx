import React from 'react';
import { MdCancel } from "react-icons/md"; // Import cancel icon
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for programmatic navigation
import axios from 'axios'; // Import axios for making HTTP requests
import { toast } from 'react-toastify'; // Import toast for displaying notifications

const Login = () => {
  // State to manage login form data
  const [loginData, setLoginData] = React.useState({
    email: '',
    password: ''
  });

  // useNavigate hook for programmatic navigation
  const Navigate = useNavigate();

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value // Update the corresponding field in the state
    });
  };

  // Function to handle form submission
  const submitLogin = async () => {
    console.log('Login Data:', loginData); 
    const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim(); 
    if (!backendUrl) {
      console.error("Backend URL is not defined. Check .env file.");
      toast.error("Server URL is missing. Contact support.");
      return;
    }
    
    const apiurl = `${backendUrl}/api/users/login`;
    console.log("API URL:", apiurl);
  
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
  
      const response = await axios.post(apiurl, loginData, { headers });
  
      if (response.data.success) {
        toast.success(response.data.message);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('role', response.data.data.role);
        sessionStorage.setItem('doctorID', response.data.data.doctorID);
        sessionStorage.setItem('email', response.data.data.email);
        sessionStorage.setItem('name', response.data.data.name);
        Navigate('/layout/dashboard');
      } else {
        toast.error(response.data.message);
        Navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm flex justify-center items-center bg-transparent'>
      {/* Login Form Container */}
      <div className='rounded-[10px] bg-white p-6 border-gray-200 border-[1px] md:min-w-[400px] shadow-md'>
        {/* Close Button */}
        <Link to={'/'} className='flex justify-end mb-2 bg-white cursor-pointer'>
          <MdCancel size={22} /> {/* Close icon to navigate back to the home page */}
        </Link>

        {/* Login Heading */}
        <h5 className='text-heading2 text-center bg-white'>Login</h5>

        {/* Login Form */}
        <form action="" className='flex flex-col gap-4 mt-4 bg-white'>
          {/* Email Input */}
          <div className='flex flex-col gap-1 bg-white'>
            <label htmlFor="email" className='bg-white'>Email</label>
            <input
              type="email"
              name="email"
              className='bg-white border-[1px] border-gray-300 rounded-md outline-none py-1 px-2'
              onChange={handleInputChange} // Handle input change
            />
          </div>

          {/* Password Input */}
          <div className='flex flex-col gap-1 bg-white'>
            <label htmlFor="password" className='bg-white'>Password</label>
            <input
              type="password"
              name="password"
              className='bg-white border-[1px] border-gray-300 rounded-md outline-none py-1 px-2'
              onChange={handleInputChange} // Handle input change
            />
          </div>

          {/* Login Button */}
          <div
            className='mt-4 hover:cursor-pointer button border-[1px] border-gray-500 bg-primary text-white hover:bg-primaryhover text-center'
            onClick={submitLogin} // Handle form submission on click
          >
            Login
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;