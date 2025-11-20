'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Product } from '@/lib/api'
import ProductCard from './ProductCard'
import { apiClient } from '@/lib/api'

interface PersonalizedRecommendationsProps {
  title?: string
  maxItems?: number
  showPersonalizedMessage?: boolean
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  title = "Recommended for You",
  maxItems = 8,
  showPersonalizedMessage = true
}) => {
  const { userProfile, trackEvent, getPersonalizedRecommendations } = useAnalytics()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [personalizedMessage, setPersonalizedMessage] = useState('')

  const getPersonalizedProducts = useCallback(async (): Promise<Product[]> => {
    if (!userProfile) return []

    try {
      // Build filters based on user preferences
      const filters: any = {}

      // Filter by favorite categories - skip if it's a name (not an ID)
      if (userProfile.preferences.favoriteCategories.length > 0) {
        const category = userProfile.preferences.favoriteCategories[0]
        // Only use if it looks like an ObjectId (24 hex characters)
        if (/^[0-9a-fA-F]{24}$/.test(category)) {
          filters.category = category
        }
      }

      // Filter by price range
      if (userProfile.preferences.priceRange.min > 0 || userProfile.preferences.priceRange.max < 10000) {
        filters.minPrice = userProfile.preferences.priceRange.min
        filters.maxPrice = userProfile.preferences.priceRange.max
      }

      // Filter by favorite colors
      if (userProfile.preferences.favoriteColors.length > 0) {
        filters.colors = userProfile.preferences.favoriteColors
      }

      // Filter by favorite brands - convert brand names to IDs
      if (userProfile.preferences.favoriteBrands.length > 0) {
        try {
          const brandName = userProfile.preferences.favoriteBrands[0]
          // Check if it's already an ID (ObjectId format)
          if (/^[0-9a-fA-F]{24}$/.test(brandName)) {
            filters.brand = brandName
          } else {
            // Try to find brand by name
            const brands = await apiClient.getBrands()
            const brandArray = Array.isArray(brands) ? brands : (brands as any).data || []
            const foundBrand = brandArray.find((b: any) => 
              b.name?.toLowerCase() === brandName.toLowerCase() || 
              b.slug?.toLowerCase() === brandName.toLowerCase()
            )
            if (foundBrand?._id) {
              filters.brand = foundBrand._id
            }
            // If brand not found, skip brand filtering to avoid 400 error
          }
        } catch (brandError) {
          // Skip brand filtering if we can't fetch brands
          console.warn('Could not resolve brand ID, skipping brand filter:', brandError)
        }
      }

      // Filter by size preferences
      if (userProfile.preferences.sizePreferences.length > 0) {
        filters.sizes = userProfile.preferences.sizePreferences
      }

      // Pakistani clothing specific filters
      if (userProfile.preferences.bodyType.length > 0) {
        filters.bodyType = userProfile.preferences.bodyType
      }

      if (userProfile.preferences.occasion.length > 0) {
        filters.occasion = userProfile.preferences.occasion[0]
      }

      if (userProfile.preferences.season.length > 0) {
        filters.season = userProfile.preferences.season[0]
      }

      // Get products with personalized filters
      const response = await apiClient.getProducts(filters)
      return response.data

    } catch (error) {
      console.error('Error getting personalized products:', error)
      return []
    }
  }, [userProfile])

  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      
      if (!userProfile) {
        // Show trending products for new users
        const trendingProducts = await apiClient.getTrendingProducts()
        setRecommendations((trendingProducts as any).data.slice(0, maxItems))
        setPersonalizedMessage('Discover our trending collection')
        return
      }

      // Get personalized recommendations based on user profile
      const personalizedProducts = await getPersonalizedProducts()
      setRecommendations(personalizedProducts.slice(0, maxItems))
      
      // Generate personalized message
      generatePersonalizedMessage()
      
    } catch (error) {
      console.error('Error loading recommendations:', error)
      // Fallback to trending products
      const trendingProducts = await apiClient.getTrendingProducts()
      setRecommendations((trendingProducts as any).data.slice(0, maxItems))
    } finally {
      setLoading(false)
    }
  }, [userProfile, maxItems, getPersonalizedProducts])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const generatePersonalizedMessage = () => {
    if (!userProfile) return

    const messages = []

    // Based on visit frequency
    if (userProfile.behavior.totalVisits > 10) {
      messages.push('Welcome back!')
    } else if (userProfile.behavior.totalVisits > 3) {
      messages.push('We\'re getting to know your preferences!')
    } else {
      messages.push('Discover products you\'ll love!')
    }

    // Based on preferences
    if (userProfile.preferences.favoriteCategories.length > 0) {
      const category = userProfile.preferences.favoriteCategories[0]
      messages.push(`Curated ${category} products for you`)
    }

    // Based on purchase history
    if (userProfile.behavior.purchaseHistory.totalPurchases > 0) {
      messages.push('Based on your previous purchases')
    }

    // Based on location
    if (userProfile.location) {
      messages.push(`Perfect for ${userProfile.location.city}`)
    }

    setPersonalizedMessage(messages.join(' • '))
  }

  const handleProductClick = (product: Product) => {
    trackEvent({
      type: 'product_view',
      data: { product },
      timestamp: new Date().toISOString(),
      sessionId: ''
    })
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
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

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {showPersonalizedMessage && personalizedMessage && (
            <p className="text-lg text-gray-600">
              {personalizedMessage}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div key={product._id} onClick={() => handleProductClick(product)}>
              <ProductCard 
                id={product._id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images[0] || '/images/1.png'}
                category={product.categories?.[0] || product.category || 'Uncategorized'}
                isNew={product.isNew}
                isOnSale={product.isSale}
                slug={product.slug}
              />
            </div>
          ))}
        </div>

        {userProfile && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Recommendations based on your preferences and browsing history
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalizedRecommendations