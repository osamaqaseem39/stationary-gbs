'use client'

import { motion } from 'framer-motion'

export default function CollectionBanner() {
  return (
    <div className="bg-white py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 gap-4 lg:gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-64 lg:h-96"
            >
              <img
                src="/images/banner3.png"
                alt="Book Collection"
                className="w-full h-full object-cover lg:rounded-r-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-50/30" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}