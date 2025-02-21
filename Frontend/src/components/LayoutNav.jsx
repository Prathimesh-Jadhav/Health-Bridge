import React, { useEffect, useState, useContext } from 'react';
import avatar from '../assets/avatar.svg'; // Import avatar image
import downArrow from '../assets/downArrow.svg'; // Import down arrow image
import { AppContext } from '../context/GlobalContext'; // Import global context for shared state
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { sidebarOptions } from '../data'; // Import sidebar options data
import { HiOutlineMenu } from "react-icons/hi";

const LayoutNav = () => {
  // Access global context for page title and user information
  const { pageTitle, user } = useContext(AppContext);

  // State to manage the visibility of the dropdown menu
  const [openMenu, setOpenMenu] = useState(false);

  // State to store menu options based on the user role
  const [menuOptions, setMenuOptions] = useState([]);

  const navigate = useNavigate(); // Hook for navigation

  // useEffect to set menu options based on the user role when the component mounts or user changes
  useEffect(() => {
    if (user && sidebarOptions[user]) {
      setMenuOptions(sidebarOptions[user]);
    } else {
      setMenuOptions([]);
    }
  }, [user]);

  // useEffect to handle closing the dropdown menu when clicking outside of it
  useEffect(() => {
    const handleMenuClickOutside = (e) => {
      // Check if the click is outside the dropdown menu
      if (!e.target.closest('.menu') && !e.target.closest('.svg')) {
        setOpenMenu(false); // Close the menu
      }
    };

    // Add event listener to handle clicks outside the menu
    window.addEventListener('click', handleMenuClickOutside);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleMenuClickOutside);
    };
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/'); // Navigate to home page
    window.location.reload(); // Reload the page to reset the application state
  };

  return (
    <div className='sm:px-[20px]  max-sm:px-[15px] flex justify-between items-center py-4 w-full gap-2 border-b-[1px]'>
      {/* Page Title */}
      <div className='text-3xl font-medium'>{pageTitle}</div>

      {/* User Avatar and Dropdown Menu */}
      <div className='flex items-center gap-4'>
        {/* Desktop View: User Avatar and Dropdown */}
        <div>
          <div className='flex items-center hover:cursor-pointer relative menu max-2xl:hidden' onClick={() => setOpenMenu(!openMenu)}>
            {/* User Avatar */}
            <div className='min-h-[40px] min-w-[30px] rounded-full bg-[#973f3c] overflow-hidden'>
              <img src={avatar} width={45} alt="User Avatar" />
            </div>

            {/* Dropdown Arrow */}
            <div className='max-2xl:hidden'>
              <img src={downArrow} alt="Dropdown Arrow" width={20} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className='2xl:hidden svg' onClick={() => {console.log(openMenu); setOpenMenu(!openMenu)}}>
            <HiOutlineMenu size={30} className="cursor-pointer"/>
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div className='absolute top-16 right-6 bg-white menu rounded-lg border-[1px] border-gray-200 flex flex-col gap-2 p-4 z-50 shadow-lg min-w-[150px] 2xl:hidden'>
              {/* Render menu options based on user role */}
              {menuOptions.length > 0 ? (
                menuOptions.map((item, index) => (
                  <Link
                    to={item.path} // Navigate to the specified path
                    key={index}
                    className='text-gray-700 hover:text-white hover:bg-secondary px-2 py-1 rounded-lg hover:cursor-pointer'
                    onClick={() => setOpenMenu(false)}
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="text-gray-500 px-2 py-1">No options available</div>
              )}

              {/* Logout Option */}
              <div
                className='text-gray-700 hover:text-white hover:bg-secondary px-2 py-1 rounded-lg hover:cursor-pointer'
                onClick={handleLogout} // Handle logout on click
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutNav;
