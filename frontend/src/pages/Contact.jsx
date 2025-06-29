import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { FaGithub } from "react-icons/fa";
import { CgArrowTopRight } from "react-icons/cg";
import { FaLinkedin } from "react-icons/fa6";



function Contact() {
  return (
    <div>
      <div className='text-center text-2xl pt-10'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-4 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6 w-full md:max-w-[500px] px-4 sm:px-8 md:px-10 lg:px-12'>
          <p className='font font-semibold text-gray-600 text-xl sm:mt-6 md:mt-0' >GET IN TOUCH</p>
          <p className='text-gray-500'>Crafted by- <span className='text-2xl text-black'>Vivek Bunkar</span></p>

          <p className='text-gray-500'>Email: bunkarvivek75@gmail.com</p>
          <p>
            Hi! I'm Vivek, a passionate full-stack developer who created Velvette as part of my journey
            in mastering  modern web technologies. With expertise in React.js, Node.js, and MongoDB,
            I enjoy building user-centric applications that solve real-world problems.
          </p>
          
          <div className='flex items-center gap-4'>
            <div className='text-5xl hover:scale-110 transition-all duration-500 text-gray-800 cursor-pointer'>
              <a href='https:github.com/vivekvvk123' target='_blank'><FaGithub /></a>
            </div>
            <div className='text-5xl hover:scale-110 transition-all duration-500 text-gray-800 cursor-pointer'>
              <a href='https://www.linkedin.com/in/vivek-bunkar-5b07281b2' target='_blank'><FaLinkedin /></a>
            </div>
          </div>
          <a href="https://www.devguy.tech" target='_blank'>
            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 flex items-center gap-2'>Link to Portfolio<CgArrowTopRight /></button>
          </a>
        </div>
      </div>

    </div>
  )
}

export default Contact