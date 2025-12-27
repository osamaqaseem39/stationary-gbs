'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem } from '@/lib/types'

// Extended CartItem for local storage (includes display fields)
interface LocalCartItem extends Omit<CartItem, 'product' | 'variationId'> {
  name: string
  image?: string
  size?: string
  color?: string
  variationId?: string
}

interface CartContextType {
  items: LocalCartItem[]
  itemCount: number
  addToCart: (item: Omit<LocalCartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (productId: string, variationId?: string) => void
  updateQuantity: (productId: string, quantity: number, variationId?: string) => void
  clearCart: () => void
  message: string | null
  setMessage: (message: string | null) => void
  isInCart: (productId: string, size?: string, color?: string, variationId?: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([])
  const [message, setMessage] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setItems(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error parsing cart:', error)
        setItems([])
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const addToCart = (item: Omit<LocalCartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      // Create a unique key for the cart item (productId + variationId + size + color)
      const itemKey = `${item.productId}-${item.variationId || ''}-${item.size || ''}-${item.color || ''}`
      
      const existingIndex = prev.findIndex(prevItem => {
        const prevKey = `${prevItem.productId}-${prevItem.variationId || ''}-${prevItem.size || ''}-${prevItem.color || ''}`
        return prevKey === itemKey
      })

      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity || 1)
        }
        setMessage(`${item.name} quantity updated in cart`)
        return updated
      } else {
        // Add new item
        const newItem: LocalCartItem = {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          size: item.size,
          color: item.color,
          variationId: item.variationId
        }
        setMessage(`${item.name} added to cart`)
        return [...prev, newItem]
      }
    })
  }

  const removeFromCart = (productId: string, variationId?: string) => {
    setItems(prev => {
      if (variationId) {
        return prev.filter(item => !(item.productId === productId && item.variationId === variationId))
      }
      return prev.filter(item => item.productId !== productId)
    })
    setMessage('Item removed from cart')
  }

  const updateQuantity = (productId: string, quantity: number, variationId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId)
      return
    }
    setItems(prev =>
      prev.map(item => {
        if (variationId) {
          return item.productId === productId && item.variationId === variationId
            ? { ...item, quantity }
            : item
        }
        return item.productId === productId ? { ...item, quantity } : item
      })
    )
  }

  const clearCart = () => {
    setItems([])
    setMessage(null)
  }

  const isInCart = (productId: string, size?: string, color?: string, variationId?: string) => {
    return items.some(item => {
      if (variationId) {
        return item.productId === productId && 
               item.variationId === variationId &&
               item.size === (size || undefined) && 
               item.color === (color || undefined)
      }
      return item.productId === productId && 
             item.size === (size || undefined) && 
             item.color === (color || undefined)
    })
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        message,
        setMessage,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

