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
    console.log('Login Data:', loginData); // Log the form data for debugging
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
    const apiurl = `${backendUrl}/api/users/login`;
    try {
      // Send a POST request to the login endpoint with the form data
      const response = await axios.post(apiurl, loginData, {
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          authorization: `Bearer ${sessionStorage.getItem('token')}` // Include authorization token if available
        }
      });

      console.log('response.data.success:', response.data.success); // Log the success status for debugging
      if (response.data.success) {
        toast.success(response.data.message); // Show success toast notification
        // Store user data in session storage
        sessionStorage.setItem('token', response.data.token); // Store the authentication token
        sessionStorage.setItem('role', response.data.data.role); // Store the user role
        sessionStorage.setItem('doctorID', response.data.data.doctorID); // Store the doctor ID (if applicable)
        sessionStorage.setItem('email', response.data.data.email); // Store the user email
        sessionStorage.setItem('name', response.data.data.name); // Store the user name
        Navigate('/layout/dashboard'); // Navigate to the dashboard on successful login
      } else {
        toast.error(response.data.message); // Show error toast notification
        Navigate('/'); // Navigate back to the home page on failure
      }
    } catch (err) {
      console.log(err); // Log the error for debugging
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message); // Show error message from the server
      } else {
        toast.error("Something went wrong. Please try again."); // Show generic error message
      }
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