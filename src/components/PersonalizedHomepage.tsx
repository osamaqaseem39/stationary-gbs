'use client'

import React, { useState, useEffect } from 'react'
import { Award, Grid3X3 } from 'lucide-react'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Product } from '@/lib/api'
import { apiClient } from '@/lib/api'
import Hero from './Hero'
import PersonalizedRecommendations from './PersonalizedRecommendations'
import FeaturedProducts from './FeaturedProducts'
import CategoryGrid from './CategoryGrid'
import Brands from './Brands'
import SchoolsSection from './SchoolsSection'

const PersonalizedHomepage: React.FC = () => {
  const { userProfile, trackEvent } = useAnalytics()
  const [personalizedContent, setPersonalizedContent] = useState({
    heroMessage: '',
    recommendedCategories: [] as string[],
    trendingProducts: [] as Product[],
    personalizedOffers: [] as string[],
    showCategories: true,
    showRecommendations: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPersonalizedContent()
  }, [userProfile])

  const loadPersonalizedContent = async () => {
    try {
      setLoading(true)

      if (!userProfile) {
        // Default content for new users
        setPersonalizedContent({
          heroMessage: 'Welcome to Gujrat Book Shop',
          recommendedCategories: ['books', 'notebooks', 'stationery'],
          trendingProducts: [],
          personalizedOffers: ['Welcome Offer: 10% off your first order'],
          showCategories: true,
          showRecommendations: true
        })
        return
      }

      // Generate personalized content based on user profile
      const content = await generatePersonalizedContent()
      setPersonalizedContent(content)

    } catch (error) {
      console.error('Error loading personalized content:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePersonalizedContent = async () => {
    if (!userProfile) return {
      heroMessage: 'Welcome to Gujrat Book Shop',
      recommendedCategories: [],
      trendingProducts: [],
      personalizedOffers: [],
      showCategories: true,
      showRecommendations: true
    }

    const content = {
      heroMessage: generateHeroMessage(),
      recommendedCategories: userProfile.preferences.favoriteCategories,
      trendingProducts: [] as Product[],
      personalizedOffers: userProfile.recommendations.personalizedOffers,
      showCategories: userProfile.behavior.totalVisits > 1,
      showRecommendations: userProfile.behavior.totalVisits > 0
    }

    // Load trending products based on user preferences
    try {
      const trendingResponse = await apiClient.getTrendingProducts()
      content.trendingProducts = (trendingResponse as any)?.slice ? (trendingResponse as any).slice(0, 4) : []
    } catch (error) {
      console.error('Error loading trending products:', error)
    }

    return content
  }

  const generateHeroMessage = (): string => {
    if (!userProfile) return 'Discover Your Perfect Style'

    const messages = []

    // Based on visit frequency
    if (userProfile.behavior.totalVisits > 10) {
      messages.push('Welcome back!')
    } else if (userProfile.behavior.totalVisits > 3) {
      messages.push('We\'re getting to know your style!')
    } else {
      messages.push('Discover your perfect style!')
    }

    // Based on preferences
    if (userProfile.preferences.favoriteCategories.length > 0) {
      const category = userProfile.preferences.favoriteCategories[0]
      messages.push(`Curated ${category} pieces for you`)
    }

    // Based on location
    if (userProfile.location) {
      messages.push(`Perfect for ${userProfile.location.city}`)
    }

    // Based on purchase history
    if (userProfile.behavior.purchaseHistory.totalPurchases > 0) {
      messages.push('Based on your previous purchases')
    }

    return messages.join(' • ')
  }

  const handleProductClick = (product: Product) => {
    trackEvent({
      type: 'product_view',
      data: { product },
      timestamp: new Date().toISOString(),
      sessionId: ''
    })
  }

  const handleCategoryClick = (category: string) => {
    trackEvent({
      type: 'category_click',
      data: { category },
      timestamp: new Date().toISOString(),
      sessionId: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Personalized Offers */}
      {personalizedContent.personalizedOffers.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-lg font-medium">
                {personalizedContent.personalizedOffers[0]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-xl font-bold mb-2">📚 Books</h3>
              <p className="text-blue-100">Textbooks, Novels & More</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">✏️ Stationery</h3>
              <p className="text-blue-100">Pens, Notebooks & Supplies</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">👔 Uniforms</h3>
              <p className="text-blue-100">School & Sports Uniforms</p>
            </div>
          </div>
        </div>
      </div>


      {/* Trending Products */}
      {personalizedContent.showRecommendations && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PersonalizedRecommendations 
              title={"Trending Now"}
              maxItems={8}
              showPersonalizedMessage={false}
            />
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Grid3X3 className="h-8 w-8 text-blue-600" />
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products organized by category
            </p>
          </div>
          <CategoryGrid showHeader={false} />
        </div>
      </div>

      {/* Schools & Educational Boards */}
      <SchoolsSection />

      {/* Featured Products */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-blue-600" />
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked bestsellers and trending products our customers love
            </p>
          </div>
          <FeaturedProducts showHeader={false} />
        </div>
      </div>

      {/* Brands */}
      <Brands />

      {/* User Profile Insights removed per request */}
    </div>
  )
}

export default PersonalizedHomepage
