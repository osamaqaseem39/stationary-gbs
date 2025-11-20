'use client'

import { ChevronDown, Heart, ShoppingBag, User, HelpCircle, BookOpen, X, Home, Sparkles, Tag, Star, Percent, Users } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const navigationItems = [
    { name: 'All', href: '/shop', icon: Home },
    { name: 'New Arrivals', href: '/shop?filter=new', icon: Sparkles },
    { 
      name: 'Books', 
      href: '/shop?category=books', 
      icon: BookOpen
    },
    { name: 'Brands', href: '/brands', icon: Tag },
    { name: 'Top Curations', href: '/shop?filter=featured', icon: Star },
    { name: 'Sale', href: '/shop?filter=sale', icon: Percent },
  ]

  const accountItems = [
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { name: 'Blogs', href: '#', icon: BookOpen },
    { name: 'Help Center', href: '#', icon: HelpCircle },
    { name: 'Sign In / Register', href: '/login', icon: User },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-24 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
        <div className="p-6">
          {/* Main Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </div>
                </a>
                
                {/* Submenu removed for Women */}
              </div>
            ))}
          </nav>

          {/* Separator */}
          <div className="my-6 border-t border-gray-200" />

          {/* Account Section */}
          <nav className="space-y-2">
            {accountItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif font-bold text-gradient">Gujrat Book Shop</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item, index) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </div>
                    </a>
                    
                    {/* Submenu removed for Women */}
                  </div>
                ))}
              </nav>

              {/* Separator */}
              <div className="my-6 border-t border-gray-200" />

              {/* Account Section */}
              <nav className="space-y-2">
                {accountItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}