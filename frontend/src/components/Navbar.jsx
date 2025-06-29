import React, { useState, useContext } from 'react'
import {assets} from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx';

function Navbar() {

  const [visible, setVisible] = useState(false);

  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);
  const adminURL = import.meta.env.VITE_ADMIN_URL;
  const logout = () => {
    localStorage.removeItem("token");
    setToken('');
    setCartItems({});
    navigate('/login');
  }

  return (
    <>
      <div className='px-2 sm:px-4 md:px-8 lg:px-32  shadow-md sticky top-0 z-50 backdrop-blur-2xl'>
        <div className='flex items-center justify-between py-2 font-medium border-b border-gray-300'>
          <div>
            <Link to="/"><img src={assets.main_logo} className='w-32' alt="" /></Link>
          </div>
          <div className='flex items-center justify-between gap-5 text-3xl'>
            <ul className='hidden sm:flex gap-5 text-base text-gray-700'>
                <NavLink to="/" className={({isActive}) => isActive ? 'underline underline-offset-3 underline-blue-500 decoration-red-400' : ''} >
                    <li>Home</li>
                </NavLink>
            </ul>
            <ul className='hidden sm:flex gap-5 text-base text-gray-700'>
                <NavLink to="/collection" className={({isActive}) => isActive ? 'underline underline-offset-3 underline-blue-500 decoration-red-400' : ''} >
                    <li>Collection</li>
                </NavLink>
            </ul>
            <ul className='hidden sm:flex gap-5 text-base text-gray-700'>
                <NavLink to="/about" className={({isActive}) => isActive ? 'underline underline-offset-3 underline-blue-500 decoration-red-400' : ''} >
                    <li>About</li>
                </NavLink>
            </ul>
            <ul className='hidden sm:flex gap-5 text-base text-gray-700'>
                <NavLink to="/contact" className={({isActive}) => isActive ? 'underline underline-offset-3 underline-blue-500 decoration-red-400' : ''} >
                    <li>Contact</li>
                </NavLink>
            </ul>
          </div>

          <div className='flex items-center gap-6'>
            <img onClick={()=>{setShowSearch(true); navigate('/collection')}} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
          {token && 
          <>
          
            <div className='group relative'>

              <img onClick={()=>token ? null : navigate('/')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />

              {/* Drop down */}
              {
                token &&
                <div className='group-hover:block hidden absolute dropdown-menu -right-3 pt-4'>
                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded' >
                  <p onClick={()=>navigate('/')} className='cursor-pointer hover:text-black'>My Profile</p>
                  <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                  <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                </div>
              </div>
              }
            </div>
          </>}

            <Link to="/cart" className='relative'>
              <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
              <p className='absolute -right-[10px] top-[10px] w-5 text-center bg-black text-white aspect-square rounded-full text-[12px]'>{getCartCount()}</p>
            </Link>

          {!token && 
          <div className='hidden sm:flex gap-2'>
            <Link to="/login" className='text-gray-600 text-md border px-3 hover:bg-gray-200 py-1 rounded-2xl hover:text-black'>Login</Link>
            <button onClick={()=>window.location.href=adminURL} className='text-gray-600 text-md border px-3 hover:bg-gray-200 py-1 rounded-2xl hover:text-black'>
              Admin
            </button>
          </div>
          }

            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            
            {/* {visible && (
            <div className="fixed inset-0 z-[60] sm:hidden">
              <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={() => setVisible(false)}
              ></div>
              
              <div className="absolute top-0 right-0 h-full w-full bg-white">
                <div className='flex flex-col h-full'>
                  <div onClick={()=> setVisible(false)} className='flex items-center gap-4 p-6 border-b cursor-pointer bg-gray-50'>
                    <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                    <p className='text-lg font-medium'>Back</p>
                  </div>
                  
                  <div className='flex-1 py-4'>
                    <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/'>Home</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/collection'>Collection</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/about'>About</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/contact'>Contact</NavLink>
                    {
                      token ? 
                      <>
                        <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/orders'>My Orders</NavLink>
                        <button onClick={()=>{setVisible(false); logout();}} className='w-full text-left py-4 px-6 border-b text-lg text-gray-700 hover:bg-gray-100'>Logout</button>
                      </>
                      :
                      <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100`} to='/login'>Login / Sign Up</NavLink>
                    }
                  </div>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>


      {visible && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setVisible(false)}
          ></div>
          
          <div className={`absolute top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            visible ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className='flex flex-col h-full'>
              <div onClick={()=> setVisible(false)} className='flex items-center gap-4 p-6 border-b cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200'>
                <img src={assets.dropdown_icon} className='h-4 rotate-180 transition-transform duration-200' alt="" />
                <p className='text-lg font-medium'>Back</p>
              </div>
              
              <div className='flex-1'>
                <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/'>Home</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/collection'>Collection</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/about'>About</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/contact'>Contact</NavLink>
                {
                  token ? 
                  <>
                    <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/orders'>My Orders</NavLink>
                    <button onClick={()=>{setVisible(false); logout();}} className='w-full text-left py-4 px-6 border-b text-lg text-gray-700 hover:bg-gray-100 transition-all duration-200'>Logout</button>
                  </>
                  :
                  <NavLink onClick={()=>setVisible(false)} className={({isActive})=> `${isActive ? 'bg-black text-white' : 'text-gray-700'} block py-4 px-6 border-b text-lg hover:bg-gray-100 transition-all duration-200`} to='/login'>Login / Sign Up</NavLink>
                }
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Navbar