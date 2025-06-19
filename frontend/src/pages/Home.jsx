import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'

function Home() {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
    </div>
  )
}

export default Home