'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiClient, Brand as ApiBrand } from '@/lib/api'

interface UiBrand {
  id: string
  name: string
  slug: string
  logo?: string
  rating?: number
  products?: number
  description?: string
  isPremium?: boolean
  isTopRated?: boolean
}

export default function Brands() {
  const [brands, setBrands] = useState<UiBrand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getBrands()
        const mapped: UiBrand[] = (data || []).map((b: ApiBrand) => ({
          id: b._id,
          name: b.name,
          slug: b.slug,
          logo: b.logo || '/images/logo.png',
          // Optional placeholders; replace with real values when available
          rating: undefined,
          products: undefined,
          description: b.description,
          isPremium: undefined,
          isTopRated: undefined,
        }))
        setBrands(mapped)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setBrands([])
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Crown className="h-8 w-8 text-blue-600" />
            Our Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trusted publishers and brands offering quality books and stationery products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? Array.from({ length: 6 }) : brands).map((brand, index) => (
            <motion.div
              key={(brand as UiBrand)?.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-6"
            >
              {loading ? (
                <div className="animate-pulse">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full" />
                  <div className="h-4 w-32 mx-auto bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-40 mx-auto bg-gray-100 rounded" />
                </div>
              ) : (
                <Link href={`/brands/${(brand as UiBrand).slug}`}>
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={(brand as UiBrand).logo || '/images/logo.png'}
                        alt={(brand as UiBrand).name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {(brand as UiBrand).name}
                    </h3>
                    {/* Optional metadata if available later */}
                    {(brand as UiBrand).description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {(brand as UiBrand).description}
                      </p>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700">
                        View Brand
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/brands" className="btn-secondary">
            View All Brands
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
