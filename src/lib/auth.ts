import { API_BASE_URL, getCorsHeaders, getCorsConfig } from './api'
import type { Customer, User, Address } from './types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

// Customer with populated user data (for frontend display)
export interface CustomerWithUser extends Customer {
  user?: User
  addresses?: Address[]
}

export async function loginCustomer(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      ...getCorsHeaders(),
      'Content-Type': 'application/json',
    },
    ...getCorsConfig(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function registerCustomer(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      ...getCorsHeaders(),
      'Content-Type': 'application/json',
    },
    ...getCorsConfig(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Registration failed')
  return res.json()
}

export async function getCurrentUser(token: string): Promise<CustomerWithUser> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      ...getCorsHeaders(),
      'Authorization': `Bearer ${token}`,
    },
    ...getCorsConfig(),
  })
  if (!res.ok) throw new Error('Failed to get user')
  const payload = await res.json()
  
  // Normalize response - backend may return customer with populated user
  const customer = payload?.data?.customer || payload?.customer || payload?.data || payload
  
  // If customer has userId, we might need to fetch user separately
  // For now, assume backend returns populated user
  return customer as CustomerWithUser
}

// Helper to get user data from customer
export function getUserFromCustomer(customer: CustomerWithUser): User | null {
  if (customer.user) {
    return customer.user
  }
  // Fallback: construct user from customer if user is not populated
  if ((customer as any).email || (customer as any).firstName) {
    return {
      _id: (customer as any).userId || customer._id,
      email: (customer as any).email || '',
      firstName: (customer as any).firstName || '',
      lastName: (customer as any).lastName || '',
      phone: (customer as any).phone,
      userType: 'customer',
      isActive: true,
      emailVerified: (customer as any).emailVerified || false,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    } as User
  }
  return null
}


