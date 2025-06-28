import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.main_logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>
                    Your premier destination for quality fashion and style. We bring you the latest trends 
                    with exceptional quality and unbeatable prices. Shop with confidence at Velvette.
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-4 '>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Privacy Policy</li>
                    <li>Terms & Conditions</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+91 987654-43210</li>
                    <li>contact@velvette.com</li>
                    <li>Mon-Sat: 9AM-6PM</li>
                </ul>
            </div>

        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright {new Date().getFullYear()}@velvette.com - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer