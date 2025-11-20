'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, CreditCard, Shield, Truck } from 'lucide-react'
import Image from 'next/image'

const footerLinks = {
  about: [
    { name: 'Our Heritage', href: '#' },
    { name: 'Atelier', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Craftsmanship', href: '#' }
  ],
  customerService: [
    { name: 'Personal Styling', href: '#' },
    { name: 'Size Consultation', href: '#' },
    { name: 'Private Viewing', href: '#' },
    { name: 'Contact Atelier', href: '#' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' }
  ]
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' }
]

const paymentMethods = [
  { name: 'Visa', icon: CreditCard },
  { name: 'Mastercard', icon: CreditCard },
  { name: 'PayPal', icon: CreditCard },
  { name: 'Apple Pay', icon: CreditCard }
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <div className="mb-4">
              <a href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Gujrat Book Shop"
                  width={120}
                  height={120}
                  className="h-16 w-auto"
                />
              </a>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Your trusted source for books, stationery, and educational supplies. Quality products for students, professionals, and book lovers.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                  <social.icon className="h-4 w-4 text-gray-600" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3">Heritage</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3">Concierge</h4>
            <ul className="space-y-2">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
          >
            <p>&copy; 2024 Gujrat Book Shop. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Serving students and book lovers since day one</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}