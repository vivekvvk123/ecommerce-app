import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/assets'

function Contact() {
  return (
    <div>
      <div className='text-center text-2xl pt-10'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font font-semibold text-gray-600' >Our Store</p>
          <p className='text-gray-500'>400001 Dalal Street, Mumbai <br /> Near Andheri, Navi Mumbai, India</p>
          <p className='text-gray-500'>Tel: +91 9876543210 <br /> Email: bunkarvivek75@gmail.com</p>
          <p className='text-xl font-semibold text-gray-600'>Careers at Velvette</p>
          <p className='text-gray-500'>Learn more about team and job openings</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact