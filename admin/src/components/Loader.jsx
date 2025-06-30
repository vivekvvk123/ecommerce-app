import React from 'react'
import '../components/Loader.css' 

function Loader() {
  return (
    <div className={`flex justify-center items-center h-screen -mt-12 mx-auto `}>
      <div className="loader "></div>
    </div>
  )
}

export default Loader