import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login({setToken}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async(e) => {
        try{
            e.preventDefault();
            // console.log(email, password)

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

    }

  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white shadow-md rounded-lg px-10 py-8 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                <input onChange={(e)=>{setEmail(e.target.value)}} value={email} className='rounded-md w-full px-3  py-2 border border-gray-300 outline-none' type="email" placeholder='example@email.com' required />
                </div>
                <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input onChange={(e)=>{setPassword(e.target.value)}} value={password} className='rounded-md w-full px-3  py-2 border border-gray-300 outline-none' type="password" placeholder='Enter password' required />
                </div>

                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login