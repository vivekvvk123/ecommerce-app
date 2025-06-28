import React from 'react'
import {assets} from '../assets/assets'

const clientURL = import.meta.env.VITE_CLIENT_URL;

function Navbar({setToken}) {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.main_logo} alt="" />
        <div className='flex gap-2'>
          <button onClick={()=>window.location.href=clientURL} className='hover:bg-orange-500 bg-orange-400 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm'>Client</button>
          <button onClick={()=>setToken('')} className='hover:bg-black bg-gray-800 text-white px-5 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
        </div>
    </div>
  )
}

export default Navbar