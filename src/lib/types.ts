// Normalized types matching backend schemas

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  userType: 'customer' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  userId: string;
  type: 'billing' | 'shipping' | 'both';
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  userId: string;
  user?: User;
  loyaltyPoints: number;
  preferredCurrency: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPricing {
  _id: string;
  productId: string;
  basePrice: number;
  salePrice?: number;
  costPrice: number;
  currency: string;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInventory {
  _id: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  warehouse?: Warehouse;
  currentStock: number;
  reservedStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock?: number;
  size?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface ProductAttribute {
  _id: string;
  productId: string;
  attributeId: string;
  attribute?: Attribute;
  value: string | number | boolean;
  displayValue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  _id: string;
  name: string;
  slug: string;
  type: 'select' | 'text' | 'number';
  values: string[];
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  country?: string;
  foundedYear?: number;
  industry?: string;
  parentBrandId?: string;
  parentBrand?: Brand;
  level: 'main' | 'sub';
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

// Normalized Product interface
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  type: 'simple' | 'variable';
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  
  // References
  brandId?: string;
  brand?: Brand;
  categories: string[];
  categoryObjects?: Category[];
  tags?: string[];
  sizeChartId?: string;
  
  // Related data (populated)
  pricing?: ProductPricing;
  inventory?: ProductInventory[];
  attributes?: ProductAttribute[];
  
  // Images
  images: string[];
  
  // Dimensions
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  // Stock management
  manageStock: boolean;
  allowBackorders: boolean;
  
  // Computed/display fields
  price?: number; // From pricing.basePrice
  salePrice?: number; // From pricing.salePrice
  originalPrice?: number; // Computed
  inStock?: boolean; // Computed from inventory
  stockQuantity?: number; // Computed from inventory
  availableSizes?: string[];
  colors?: string[];
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  
  createdAt: string;
  updatedAt: string;
}

// Frontend-friendly Product (for display)
export interface DisplayProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  isSale: boolean;
  images: string[];
  brand: string; // Brand name
  brandId?: string;
  category: string; // Primary category name
  categories: string[]; // Category names or IDs
  inStock: boolean;
  stockQuantity: number;
  availableSizes?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categories?: string[];
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  status?: string;
  sizes?: string[];
  colors?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CartItem {
  _id?: string;
  cartId?: string;
  productId: string;
  product?: Product;
  variationId?: string;
  quantity: number;
  price: number; // Snapshot at time of add
  size?: string;
  color?: string;
}

export interface Cart {
  _id: string;
  customerId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  couponId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  product?: Product;
  variationId?: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  items: OrderItem[];
  billingAddressId: string;
  billingAddress?: Address;
  shippingAddressId: string;
  shippingAddress?: Address;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethodId?: string;
  paymentMethod?: any;
  shippingMethodId?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  couponId?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

