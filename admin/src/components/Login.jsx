import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const clientURL = import.meta.env.VITE_CLIENT_URL+'/login';


function Login({setToken}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async(e) => {
        try{
            e.preventDefault();
            setIsLoading(true);
            // const response = await fetch(import.meta.env.VITE_BACKEND_URL + 'api/user/admin', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({email, password})
            // });

            const response = await axios.post(backendUrl + '/api/user/admin',{email,password})

            // Now check if we got a token
            if(response.data.success){
                setToken(response.data.token);
            }else{
                toast.error(response.data.message);
            }

        }
        catch(err){
            console.error(err);
            toast.error(error.message);
        }
        finally{
            setIsLoading(false);
        }

    }

  return (
    <div className='min-h-screen flex items-center justify-center'>

            <div className='bg-white shadow-md rounded-lg px-6 py-8 w-full max-w-[340px] m-2 '>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-36'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e)=>{setEmail(e.target.value)}} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='example@email.com' required />
                    </div>
                    <div className='mb-3 min-w-36'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e)=>{setPassword(e.target.value)}} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter password' required />
                    </div>

                    <button disabled={isLoading} className={` ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black'} mt-2 w-full py-2 px-4 rounded-md text-white flex items-center justify-center gap-4`} type='submit'>
                        {isLoading && (<div className='animate-spin rounded-full h-4 w-4 border-white border-b-2'></div>)}Login</button>

                </form>
                <div className='flex items-center justify-center'>
                <button onClick={()=>window.location.href=clientURL} className='mt-2 hover:text-gray-600 text-sm' type='submit'>Not an Admin ?</button>
                </div>
            </div>
    </div>
  )
}

export default Login