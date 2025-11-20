'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand?: string
  color?: string
  isNew?: boolean
  isOnSale?: boolean
  slug?: string
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  brand,
  color,
  isNew = false,
  isOnSale = false,
  slug
}: ProductCardProps) {
  return (
    <Link href={slug ? `/products/${slug}` : `/products/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative bg-white rounded-lg overflow-hidden card-hover cursor-pointer"
      >
        {/* Image Container - 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          {(isNew || isOnSale) && (
            <div className="absolute top-2 left-2 flex gap-1">
              {isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                  New
                </span>
              )}
              {isOnSale && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                  Sale
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Info - Minimal Design */}
        <div className="p-3">
          {/* Name and Brand in one line */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 truncate flex-1">{name}</h3>
            {brand && (
              <span className="text-xs text-gray-500 flex-shrink-0">{brand}</span>
            )}
          </div>

          {/* Price and Add to Cart in one line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-blue-600">
                ₨{typeof price === 'number' ? price.toLocaleString() : '0'}
              </span>
              {originalPrice && typeof originalPrice === 'number' && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  ₨{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic here
              }}
              className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}