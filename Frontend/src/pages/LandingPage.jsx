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
      <div className='px-[40px] max-md:px-[20px] flex items-center justify-between md:mt-[150px] w-full xl:mb-[60px] flex-row max-2xl:flex-col-reverse max-xl:gap-6'>
        {/* Left Section */}
        <div className='flex flex-col gap-2 text-5xl font-bold leading-tight w-[50%] max-lg:text-heading1 max-2xl:w-full max-2xl:text-center'>
          <p>Seamless Reports.</p>
          <p>Smarter Policies.</p>
          <p>Healthier Communities.</p>
          <div className='flex gap-4 mt-2 hover:cursor-pointer max-2xl:justify-center' onClick={() => navigate('/login')}>
            <div className='button border-[1px] text-2xl px-[80px] border-gray-500 bg-primary text-white hover:bg-primaryhover text-md rounded-full max-md:hidden '>
              Login
            </div>
          </div>
        </div>

        {/* Right Section - Lottie Animation */}
        <div className='w-[50%] flex justify-center max-md:w-full max-md:mt-[50px]'>  
          <Lottie
            options={{
              animationData: animation,
              loop: true,
            }}
            height={400}
            width={400}
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