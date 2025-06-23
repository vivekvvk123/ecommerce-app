import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

function Sidebar() {
  return (
    <div className='w-[20%] min-h-screen border-r-1'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l-lg' to={'/add'} >
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Items</p>
            </NavLink>
            <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l-lg' to={'/list'} >
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>List Items</p>
            </NavLink>
            <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l-lg' to={'/orders'} >
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar