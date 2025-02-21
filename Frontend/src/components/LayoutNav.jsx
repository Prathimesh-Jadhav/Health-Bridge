import React, { useEffect } from 'react'
import avatar from '../assets/avatar.svg' // Import avatar image
import downArrow from '../assets/downArrow.svg' // Import down arrow image
import { AppContext } from '../context/GlobalContext'; // Import global context for shared state
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { sidebarOptions } from '../data'; // Import sidebar options data

const LayoutNav = () => {
  // Access global context for page title and user information
  const { pageTitle, user } = React.useContext(AppContext);

  // State to manage the visibility of the dropdown menu
  const [openMenu, setOpenMenu] = React.useState(false);

  // State to store menu options based on the user role
  const [menuOptions, setMenuOptions] = React.useState(false);

  const Navigate = useNavigate(); // Navigate to a new page

  // useEffect to set menu options based on the user role when the component mounts or user changes
  useEffect(() => {
    setMenuOptions(sidebarOptions[user]); // Set menu options from sidebarOptions based on the user role
  }, [user]);

  // useEffect to handle closing the dropdown menu when clicking outside of it
  useEffect(() => {
    const handleMenu = (e) => {
      // Check if the click is outside the dropdown menu
      if (e.target.closest('.menu') === null) {
        setOpenMenu(false); // Close the menu
      }
    };

    // Add event listener to handle clicks outside the menu
    window.addEventListener('click', handleMenu);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleMenu);
    };
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    sessionStorage.clear();
    Navigate('/') // Clear session storage
    window.location.reload(); // Reload the page to reset the application state
  };

  return (
    <div className='sm:px-[20px] max-sm:px-[10px] flex justify-between items-center py-4 w-full gap-2 border-b-[1px]'>
      {/* Page Title */}
      <div className='text-3xl font-medium'>
        {pageTitle} {/* Display the current page title from global context */}
      </div>

      {/* User Avatar and Dropdown Menu */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center hover:cursor-pointer relative menu' onClick={() => setOpenMenu(!openMenu)}>
          {/* User Avatar */}
          <div className='min-h-[40px] min-w-[30px] rounded-full bg-[#973f3c]'>
            <img src={avatar} width={45} alt="User Avatar" />
          </div>

          {/* Dropdown Arrow */}
          <div>
            <img src={downArrow} alt="Dropdown Arrow" width={20} />
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div className='absolute top-16 right-6 bg-white rounded-lg border-[1px] border-gray-200 flex flex-col gap-2 p-4 z-50 shadow-lg min-w-[150px] xl:hidden'>
              {/* Render menu options based on user role */}
              {menuOptions?.map((item, index) => {
                return (
                  <Link
                    to={item.path} // Navigate to the specified path
                    key={index}
                    className='text-gray-700 hover:text-white hover:bg-secondary px-2 py-1 rounded-lg hover:cursor-pointer'
                  >
                    {item.title} {/* Display the menu option title */}
                  </Link>
                );
              })}

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