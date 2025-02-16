import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='px-[100px] max-md:px-[20px] h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-10'>
        <div className='text-[28px] font-bold'>Health<span className='text-primary'>Bridge</span></div>
        <div className='flex gap-2 items-center'> 
            <Link to='/login' className='button border-[1px] border-gray-500 bg-primary  text-white hover:bg-primaryhover max-md:hidden'>Login</Link>
        </div>
    </div>
  )
}

export default Navbar
