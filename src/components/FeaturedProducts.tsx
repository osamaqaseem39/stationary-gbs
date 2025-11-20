'use client'

import { motion } from 'framer-motion'
import { Star, Heart, ShoppingBag, Award, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiClient, Product } from '@/lib/api'

// No hardcoded data - fetch from API

interface FeaturedProductsProps {
  showHeader?: boolean
}

export default function FeaturedProducts({ showHeader = true }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getFeaturedProducts()
        setProducts(response.slice(0, 6)) // Show only 6 products
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Fallback to empty array if API fails
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showHeader && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">Loading...</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
              <TrendingUp className="h-6 w-6 text-cyan-500" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending pieces, carefully curated for the sophisticated woman.
            </p>
          </motion.div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.images[0] || '/images/1.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                  </div>
                </Link>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 font-medium">{product.rating || 0}</span>
                  <span className="text-sm text-gray-400">({product.reviews || 0} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      ₨{typeof product.price === 'number' ? product.price.toLocaleString() : '0'}
                    </span>
                    {product.originalPrice && typeof product.originalPrice === 'number' && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₨{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Award className="h-5 w-5" />
            View All Featured Products
          </Link>
        </motion.div>
        )}
      </div>
    </section>
  )
}
