import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import {toast} from 'react-toastify';

function Login() {

  const [currentState, setCurrentState] = useState('Login');
  const [isLoading, setIsLoading] = useState(false);

  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try {
          if(currentState === 'Sign Up'){
            const response = await axios.post(backendUrl + '/api/user/register', {name, email, password});
            if(response.data.success){
              setToken(response.data.token);
              localStorage.setItem("token", response.data.token);
              navigate('/');
            }
            else{
              toast.error(response.data.message);
            }
          }
          else{ // currentState is Login
            const response = await axios.post(backendUrl + '/api/user/login', {email, password});
            // console.log(response.data)
            if(response.data.success){
              setToken(response.data.token);
              localStorage.setItem("token", response.data.token);
            }
            else{
              toast.error(response.data.message);
            }
          }
        
    } 
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/');
    }
  },[token])

  
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800 rounded-3xl' placeholder='Name' required/> }

      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800 rounded-3xl' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800 rounded-3xl' placeholder='Password' required/>

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login' ? 
          <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create an account</p> : 
          <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Already have an account?</p>
        }
      </div>

      <button disabled={isLoading} 
      className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black'} text-white font-light px-8 py-2 mt-4 rounded-3xl flex items-center justify-center gap-3 transition-colors`} >
        {isLoading && (<div className='animate-spin rounded-full h-4 w-4 border-white border-b-2'></div>)}
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
       
    </form>
  )
}

export default Login