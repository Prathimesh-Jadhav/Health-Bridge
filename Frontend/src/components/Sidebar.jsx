import React, { useEffect } from 'react';
import { sidebarOptions } from '../data'; // Import sidebar options based on user roles
import avatar from '../assets/avatar.svg'; // Import avatar image
import logout from '../assets/logout.svg'; // Import logout icon
import { Link } from 'react-router-dom'; // Import Link for navigation
import { AppContext } from '../context/GlobalContext'; // Import global context for shared state

const Sidebar = () => {
  // Access global context for user role and setUser function
  const { user, setUser } = React.useContext(AppContext);

  // State to store sidebar options based on the user role
  const [options, setOptions] = React.useState([]);

  // useEffect to set the user role from session storage when the component mounts
  useEffect(() => {
    const role = sessionStorage.getItem('role').toLowerCase() || 'doctor'; // Get user role from session storage
    setUser(role); // Set the user role in global context
  }, []);

  // useEffect to set sidebar options based on the user role when the user changes
  useEffect(() => {
    setOptions(sidebarOptions[user]); // Set sidebar options based on the user role
    console.log('second useEffect'); // Log for debugging
  }, [user]);

  // Function to handle user logout
  const logoutUser = () => {
    sessionStorage.clear(); // Clear session storage
    window.location.reload(); // Reload the page to reset the application state
  };

  return (
    // Sidebar container
    <div className='min-w-[300px] min-h-[100vh] bg-primaryhover border-r-[1px] border-gray-200 pt-4 px-2 max-xl:hidden'>
      {/* Logo Section */}
      <div className='text-[28px] font-bold bg-white rounded-full px-4 py-2 text-center'>
        Health<span className='text-primary bg-white'>Bridge</span>
      </div>

      {/* Sidebar Content */}
      <div className='flex flex-col justify-between min-h-[90vh]'>
        {/* Sidebar Navigation Links */}
        <ul className='flex flex-col mt-10 px-6'>
          {/* Render sidebar options based on user role */}
          {user === 'normal' ? (
            // Render options for 'normal' user
            options?.map((item, index) => {
              return (
                <Link
                  to={item.path} // Navigate to the specified path
                  key={index}
                  className='text-gray-200 hover:text-white hover:cursor-pointer text-xl flex justify-start gap-2 items-center font-light hover:bg-primary hover:rounded-full px-4 py-1'
                >
                  <div className='flex items-center mb-1'>
                    <img src={item.icon} alt="" width={18} /> {/* Display option icon */}
                  </div>
                  <div className='flex items-center'>{item.title}</div> {/* Display option title */}
                </Link>
              );
            })
          ) : (
            // Render options for other user roles (e.g., 'doctor')
            options?.map((item, index) => {
              return (
                <Link
                  to={item.path} // Navigate to the specified path
                  key={index}
                  className='text-gray-200 hover:text-white hover:cursor-pointer text-xl flex justify-start gap-2 items-center font-light hover:bg-primary hover:rounded-full px-4 py-1'
                >
                  <div className='flex items-center mb-1'>
                    <img src={item.icon} alt="" width={18} /> {/* Display option icon */}
                  </div>
                  <div className='flex items-center'>{item.title}</div> {/* Display option title */}
                </Link>
              );
            })
          )}
        </ul>

        {/* User Profile and Logout Section */}
        <div className='px-2 flex justify-between items-center mb-4'>
          {/* User Profile */}
          <div className='flex gap-2'>
            <div className='rounded-full min-w-[50px] max-h-[50px] flex justify-center items-center bg-[#973f3c]'>
              <img src={avatar} alt="" width={40} /> {/* Display user avatar */}
            </div>
            <div className='text-white max-w-[170px]'>
              <p className='font-semibold'>{sessionStorage.getItem('name')}</p> {/* Display user name */}
              <p className='text-sm font-light'>{sessionStorage.getItem('email')}</p> {/* Display user email */}
            </div>
          </div>

          {/* Logout Button */}
          <div onClick={logoutUser} className='cursor-pointer'>
            <img src={logout} alt="" width={25} className='text-gray-100 hover:text-gray-300 hover:scale-x-110' /> {/* Display logout icon */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;