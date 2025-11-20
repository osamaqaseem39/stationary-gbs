'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  Star,
  ShoppingBag,
  
} from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: Package },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Payment Methods', href: '/dashboard/payment', icon: CreditCard },
  { name: 'Profile', href: '/dashboard/profile', icon: Star },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r border-gray-200 min-h-screen"
    >
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-900">Gujrat Book Shop</h2>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute bottom-6 left-6 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <div className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </button>
      </div>
    </motion.aside>
  )
}