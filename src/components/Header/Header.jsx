import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from "react";
import AuthModal from '../SignInandSignUp/AuthModal';

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className='lg:px-15 px-5 flex justify-between items-center py-3 border-b-1 border-b-gray-200 fixed z-50 top-0 left-0 right-0 bg-white'>
      <NavLink to="/" className='text-[#605dec] font-extrabold text-2xl'>TRIPMA</NavLink>
      <div className="flex items-center">
        <NavLink to="/" className="mx-3 hover:text-blue-700">
          Flights
        </NavLink>
        <NavLink to="/" className="mx-3 hover:text-blue-700">
          Hotels
        </NavLink>
        <NavLink to="/" className="mx-3 hover:text-blue-700">
          Packages
        </NavLink>
        <button className='mx-3 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-1
         focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600
          dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
          onClick={() => {
            setIsSignUp(false);
            setModalOpen(true);
          }}
        >
          Sign In
        </button>
        <button className='mx-3 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-1
         focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 
         dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
          onClick={() => {
            setIsSignUp(true);
            setModalOpen(true);
          }}
        >
          Sign Up
        </button>
      </div>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} isSignUp={isSignUp} />
    </div>
  )
}

export default Header