'use client'

import { motion } from 'framer-motion'
import { Package, Search, Filter, Download, Eye, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCustomer } from '@/contexts/CustomerContext'
import { apiClient } from '@/lib/api'
import type { Order as NormalizedOrder, OrderItem, Address } from '@/lib/types'

const statusColors: Record<string, string> = {
  'delivered': 'bg-green-100 text-green-800',
  'shipped': 'bg-blue-100 text-blue-800',
  'processing': 'bg-yellow-100 text-yellow-800',
  'pending': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800',
  'refunded': 'bg-purple-100 text-purple-800'
}

interface DisplayOrder {
  id: string
  orderNumber: string
  date: string
  status: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
    image: string
    sku?: string
  }>
  tracking?: string
  shippingAddress: string
  billingAddress?: string
}

export default function OrdersPage() {
  const { customer } = useCustomer()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<DisplayOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customer?._id || customer?.userId) {
      fetchOrders()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer])

  const formatAddress = (address: Address | string | undefined): string => {
    if (!address) return 'N/A'
    if (typeof address === 'string') return address
    return `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}${address.state ? ', ' + address.state : ''} ${address.postalCode}, ${address.country}`
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const customerId = customer?._id || customer?.userId
      if (!customerId) return
      
      const response = await apiClient.getCustomerOrders(customerId, { page: 1, limit: 50 })
      
      // Map normalized API response to display format
      const mappedOrders: DisplayOrder[] = (response.data || []).map((order: NormalizedOrder) => {
        const items = (order.items || []).map((item: OrderItem) => ({
          name: item.productName || item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.unitPrice,
          image: item.product?.images?.[0] || '/images/logo.png',
          sku: item.productSku
        }))
        
        return {
          id: order.orderNumber || order._id.slice(-8),
          orderNumber: order.orderNumber,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          total: order.total,
          items,
          tracking: order.trackingNumber,
          shippingAddress: formatAddress(order.shippingAddress),
          billingAddress: formatAddress(order.billingAddress)
        }
      })
      
      setOrders(mappedOrders)
    } catch (err) {
      setError('Failed to fetch orders')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-red-500 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : !customer ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Log In</h3>
            <p className="text-gray-600 mb-4">
              You need to be logged in to view your orders.
            </p>
            <a href="/login" className="btn-primary inline-block">
              Log In
            </a>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-4">
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : "No orders match your current filters."
              }
            </p>
            {orders.length === 0 && (
              <a href="/shop" className="btn-primary inline-block">
                Start Shopping
              </a>
            )}
          </div>
        ) : (
          filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status.toLowerCase()] || statusColors.pending}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₨{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₨{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">₨{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                    {order.tracking && (
                      <p><strong>Tracking:</strong> {order.tracking}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {order.tracking && (
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                        <Truck className="h-4 w-4" />
                        Track Package
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {order.status.toLowerCase() === 'delivered' && (
                      <button className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
  )
}