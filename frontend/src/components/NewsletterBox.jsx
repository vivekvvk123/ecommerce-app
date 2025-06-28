import React from 'react'

function NewsletterBox() {

    const onSubmitHandler = (e)=>{
        e.preventDefault();

    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now for price drop alerts</p>
        <p className='text-gray-400 mt-3'>
            Be the first to know when prices drop on items you love. Save more!
        </p>

        <form onSubmit={(e)=>onSubmitHandler(e)} action="" className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded-3xl'>
            <input className='w-full sm:flex-1 outline-none' type="email" required placeholder='Enter your email'/>
            <button className='bg-black text-white text-xs px-10 py-4 rounded-3xl' type='submit'>Subscribe</button>
        </form>
                
    </div>
  )
}

export default NewsletterBox