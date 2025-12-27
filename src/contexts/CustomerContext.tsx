'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCurrentUser, type CustomerWithUser } from '@/lib/auth'

interface CustomerContextType {
  customer: CustomerWithUser | null
  isLoading: boolean
  isAuthenticated: boolean
  token: string | null
  login: (token: string, customer: CustomerWithUser) => void
  logout: () => void
  refreshCustomer: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Load saved token and user from localStorage
    const savedToken = localStorage.getItem('auth_token')
    const savedCustomer = localStorage.getItem('customer')
    
    if (savedToken && savedCustomer) {
      setToken(savedToken)
      setCustomer(JSON.parse(savedCustomer))
      // Refresh customer data from API
      refreshCustomer()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = (authToken: string, customerData: Customer) => {
    setToken(authToken)
    setCustomer(customerData)
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('customer', JSON.stringify(customerData))
  }

  const logout = () => {
    setToken(null)
    setCustomer(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('customer')
  }

  const refreshCustomer = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const customerData = await getCurrentUser(token)
      setCustomer(customerData)
      localStorage.setItem('customer', JSON.stringify(customerData))
    } catch (error) {
      console.error('Failed to refresh customer data:', error)
      // Token might be invalid, logout user
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomerContext.Provider value={{
      customer,
      isLoading,
      isAuthenticated: !!customer,
      token,
      login,
      logout,
      refreshCustomer
    }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }
  return context
}

