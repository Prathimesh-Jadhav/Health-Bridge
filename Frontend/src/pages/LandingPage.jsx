import React from 'react';
import Navbar from '../components/Navbar'; // Import the Navbar component
import Lottie from 'react-lottie'; // Import Lottie for animations
import animation from '../assets/landingAnimation.json'; // Import the animation JSON file
import { Outlet, useNavigate } from 'react-router-dom'; // Import routing utilities

const LandingPage = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  return (
    <div className='px-[100px] flex flex-col justify-between max-xl:gap-[50px] min-h-[100vh] max-md:px-[20px]'>
      {/* Navbar component */}
      <Navbar />

      {/* Main content section */}
      <div className='px-[40px] max-md:px-[20px] flex items-center justify-between mt-[120px] w-full xl:mb-[60px] flex-wrap max-2xl:flex-col-reverse max-xl:gap-6'>
        {/* Left section: Text and login button */}
        <div className='flex flex-col gap-2 text-4xl font-bold leading-tight max-lg:text-heading1 max-2xl:text-center'>
          <p>Seamless Reports.</p>
          <p>Smarter Policies.</p>
          <p>Healthier Communities.</p>
          {/* Login button */}
          <div className='flex gap-4 mt-2 hover:cursor-pointer max-2xl:justify-center' onClick={() => navigate('/login')}>
            <div className='button border-[1px] text-2xl px-[80px] border-gray-500 bg-primary text-white hover:bg-primaryhover text-md rounded-full'>
              Login
            </div>
          </div>
        </div>

        {/* Right section: Lottie animation */}
        <div>
          <Lottie
            options={{
              animationData: animation, // Animation data
              loop: true, // Enable looping
              style: { width: '40%', height: '40%' }, // Animation styles
            }}
          />
        </div>
      </div>

      {/* Footer section */}
      <div className='text-center text-sm font-medium mb-2'>
        For any queries contact to @ 1452665
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default LandingPage;