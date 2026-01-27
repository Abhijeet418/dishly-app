'use client'

import HeroSection from '@/components/HeroSection'
import TrendingRecipes from '@/components/TrendingRecipes'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <TrendingRecipes />
      <CTASection />
    </div>
  )
}
