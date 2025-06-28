import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

function About() {
  return (
    <div>
      <div className='text-2xl text-center pt-8'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-700'>
          <p>Welcome to Velvette, where fashion meets quality and style meets affordability. 
            Founded with a vision to make premium fashion accessible to everyone, we've been 
            curating exceptional clothing collections that reflect the latest trends while 
            maintaining timeless elegance.</p>
          <p>Our journey began with a simple belief: everyone deserves to look and feel their best. 
            From carefully selecting fabrics to ensuring perfect fits, we're committed to delivering 
            fashion that not only looks great but feels amazing to wear. Every piece in our collection 
            tells a story of craftsmanship and attention to detail.</p>
          <b>Our Mission</b>
          <p>To democratize fashion by providing high-quality, trendy, and affordable clothing that 
            empowers individuals to express their unique style. We strive to create a shopping 
            experience that's convenient, trustworthy, and inspiring for fashion enthusiasts everywhere.</p>
        </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20 gap-5'>
        <div className='bg-white/40 shadow-lg rounded-md px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>Every product undergoes rigorous quality checks. We partner with trusted manufacturers 
            and use premium materials to ensure durability, comfort, and style that lasts. Your 
            satisfaction is our guarantee.</p>
        </div>
        <div className='bg-white/40 shadow-lg rounded-md px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience</b>
          <p className='text-gray-600'>Shop from the comfort of your home with our user-friendly platform. Fast delivery, 
            easy returns, multiple payment options, and 24/7 customer support make your shopping 
            experience seamless and stress-free.</p>
        </div>
        <div className='bg-white/40 shadow-lg rounded-md px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Best Customer Service</b>
          <p className='text-gray-600'> Our dedicated customer service team is always ready to assist you. From sizing help 
            to order tracking, we're here to ensure your complete satisfaction. Your feedback 
            helps us improve and serve you better.</p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About