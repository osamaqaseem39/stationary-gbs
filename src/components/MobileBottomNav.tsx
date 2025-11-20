'use client'

import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState('home')
  const { itemCount } = useCart()

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'search', icon: Search, label: 'Search', href: '#' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', href: '#', badge: itemCount },
    { id: 'account', icon: User, label: 'Account', href: '/dashboard' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              if (item.id === 'cart') {
                e.preventDefault()
                // Prevent navigation to cart page
              }
              setActiveTab(item.id)
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 relative ${
              activeTab === item.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-b"></div>
            )}
          </a>
        ))}
      </div>
    </nav>
  )
}