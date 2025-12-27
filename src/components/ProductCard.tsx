'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    _id,
    name,
    slug,
    price,
    originalPrice,
    salePrice,
    isSale,
    images,
    brand,
    category,
    inStock,
    stockQuantity
  } = product

  const mainImage = images?.[0] || '/images/logo.png'
  const displayPrice = price || 0
  const displayOriginalPrice = originalPrice || (salePrice && price ? price : undefined)
  const isOnSale = isSale || (salePrice && salePrice < price)

  return (
    <Link href={slug ? `/products/${slug}` : `/products/${_id}`}>
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
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/images/logo.png'
            }}
          />
          
          {/* Badges */}
          {(product.isNew || isOnSale) && (
            <div className="absolute top-2 left-2 flex gap-1">
              {product.isNew && (
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
          
          {/* Out of Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs px-3 py-1 rounded font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Minimal Design */}
        <div className="p-3">
          {/* Name and Brand in one line */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 truncate flex-1">{name}</h3>
            {brand && brand !== 'Unknown' && (
              <span className="text-xs text-gray-500 flex-shrink-0">{brand}</span>
            )}
          </div>

          {/* Price and Add to Cart in one line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-blue-600">
                ₨{displayPrice.toLocaleString()}
              </span>
              {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₨{displayOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic here - handled by parent component
              }}
              disabled={!inStock}
              className={`p-1.5 rounded transition-colors flex-shrink-0 ${
                inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}