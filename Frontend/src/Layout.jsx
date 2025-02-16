import React, { useEffect } from 'react'
import LayoutNav from './components/LayoutNav'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'
import {toast} from 'react-toastify'

const Layout = () => {

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      toast.error('Login Please');
    }
  }, [])

  return (
    <div className='flex'>
      <div>
        <Sidebar />
      </div>
      <div className='min-h-[100vh] w-full'>
        <LayoutNav />
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
