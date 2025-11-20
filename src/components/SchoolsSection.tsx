'use client'

import { motion } from 'framer-motion'
import { School, GraduationCap, BookOpen } from 'lucide-react'
import Link from 'next/link'

const popularSchools = [
  { name: 'Beaconhouse School System', slug: 'beaconhouse', students: '500+' },
  { name: 'The City School', slug: 'city-school', students: '400+' },
  { name: 'Roots School System', slug: 'roots', students: '350+' },
  { name: 'Lahore Grammar School', slug: 'lgs', students: '300+' },
  { name: 'Aitchison College', slug: 'aitchison', students: '250+' },
  { name: 'Convent of Jesus and Mary', slug: 'cjm', students: '200+' },
]

const educationalBoards = [
  { name: 'O-Levels Cambridge', icon: GraduationCap, color: 'blue' },
  { name: 'A-Levels Cambridge', icon: GraduationCap, color: 'blue' },
  { name: 'Matric Punjab Board', icon: BookOpen, color: 'cyan' },
  { name: 'Federal Board', icon: School, color: 'indigo' },
  { name: 'IB Program', icon: GraduationCap, color: 'blue' },
]

export default function SchoolsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Educational Boards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              Educational Boards
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find books and materials for your educational board
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {educationalBoards.map((board, index) => (
              <motion.div
                key={board.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link href={`/shop?board=${encodeURIComponent(board.name)}`}>
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 text-center">
                    <board.icon className={`h-12 w-12 mx-auto mb-4 text-blue-600 group-hover:text-blue-700 transition-colors`} />
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {board.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Schools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <School className="h-8 w-8 text-blue-600" />
              Popular Schools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Shop school-specific book sets and uniforms for these institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSchools.map((school, index) => (
              <motion.div
                key={school.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link href={`/shop?school=${encodeURIComponent(school.name)}`}>
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <School className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                      <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                        {school.students} students
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {school.name}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                      View Book Sets & Uniforms →
                    </p>
                  </div>
                </Link>
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
            <Link href="/shop" className="btn-secondary">
              View All Schools
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

