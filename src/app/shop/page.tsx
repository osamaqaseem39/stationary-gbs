'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import FiltersSidebar from '@/components/FiltersSidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import MobileFilters from '@/components/MobileFilters'
import Footer from '@/components/Footer'
import { Search, Filter, Star, Heart, ShoppingBag, Grid3X3, Grid2X2, Grid, Layout } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { apiClient, Product, ProductFilters } from '@/lib/api'

const sortOptions = [
  'Featured',
  'Price: Low to High',
  'Price: High to Low',
  'Newest',
  'Best Rated'
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Featured')
  const [productsPerRow, setProductsPerRow] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100000]) // Large initial range to show all products
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter options from backend
  const [categories, setCategories] = useState<string[]>(['All'])
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map()) // Map of category ID to name
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])

  // Handle URL query parameters
  useEffect(() => {
    const filterParam = searchParams?.get('filter')
    const categoryParam = searchParams?.get('category')
    
    if (filterParam) {
      setSelectedFilters([filterParam])
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch filter options from backend
        const filterOptions = await apiClient.getFilterOptions()
        const categoryNames = ['All', ...filterOptions.categories.map(cat => cat.name)]
        setCategories(categoryNames)
        
        // Create a map of category ID to name for filtering
        const catMap = new Map<string, string>()
        filterOptions.categories.forEach(cat => {
          catMap.set(cat._id, cat.name)
        })
        setCategoryMap(catMap)
        
        setColors(filterOptions.colors)
        setSizes(filterOptions.sizes)
        
        // Set price range from backend
        setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])
        
        // Fetch products
        const filters: ProductFilters = {
          page: 1,
          limit: 100, // Get more products for the shop page
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
        const response = await apiClient.getProducts(filters)
        setProducts(response.data)
        
        // Update price range based on actual product prices if needed (include sale prices)
        if (response.data.length > 0) {
          const prices = response.data.map(p => {
            // Use salePrice if available and valid, otherwise use regular price
            return (p.salePrice && typeof p.salePrice === 'number' && p.salePrice > 0) 
              ? p.salePrice 
              : p.price
          }).filter(p => p > 0)
          if (prices.length > 0) {
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            // Only update if the current range is too restrictive
            if (priceRange[1] < maxPrice || priceRange[0] > minPrice) {
              setPriceRange([Math.max(0, Math.floor(minPrice * 0.9)), Math.ceil(maxPrice * 1.1)])
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  const handleMobileFilterToggle = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen)
  }

  const handleFilterClose = () => {
    setIsMobileFiltersOpen(false)
  }

  // Helper function to check if product is on sale
  const isProductOnSale = (product: Product): boolean => {
    // If explicitly marked as sale, return true
    if (product.isSale === true) return true
    
    // If salePrice exists (regardless of value), product is on sale
    if (product.salePrice !== undefined && 
        typeof product.salePrice === 'number' && 
        product.salePrice > 0) {
      return true
    }
    
    // Check if originalPrice is higher than current price (fallback check)
    if (product.originalPrice !== undefined && 
        typeof product.originalPrice === 'number' && 
        product.originalPrice > product.price) {
      return true
    }
    
    return false
  }

  // Helper function to check if product is new
  const isProductNew = (product: Product): boolean => {
    if (product.isNew === true) return true
    // Consider products created in the last 30 days as new
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const createdAt = new Date(product.createdAt)
    return createdAt >= thirtyDaysAgo
  }

  // Helper function to check if product is featured
  const isProductFeatured = (product: Product): boolean => {
    // Featured products typically have high ratings or are marked as featured
    return !!(product.rating && product.rating >= 4.5) || 
           !!(product.reviews && product.reviews >= 10)
  }

  // Filter products based on selected criteria
  const filteredProducts = products.filter(product => {
    // Category matching: check if product.category matches selectedCategory (by name or ID)
    // or if any product.categories array item matches
    let matchesCategory = true
    if (selectedCategory !== 'All') {
      // Check if product.category (string) matches the selected category name
      const categoryMatches = product.category === selectedCategory
      
      // Check if product.category is an ID that maps to the selected category name
      const categoryIdMatches = product.category && categoryMap.has(product.category) && 
                                categoryMap.get(product.category) === selectedCategory
      
      // Check if product.categories array contains the selected category name or ID
      const categoriesArrayMatches = Array.isArray(product.categories) && 
        product.categories.some(cat => {
          if (typeof cat === 'string') {
            // Check if it's the category name
            if (cat === selectedCategory) return true
            // Check if it's a category ID that maps to the selected name
            if (categoryMap.has(cat) && categoryMap.get(cat) === selectedCategory) return true
          }
          return false
        })
      
      matchesCategory = categoryMatches || categoryIdMatches || categoriesArrayMatches
    }
    
    const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase())
    // Use salePrice if available for price filtering, otherwise use price
    const productPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
    
    // Handle special filters
    let matchesSpecialFilters = true
    if (selectedFilters.length > 0) {
      matchesSpecialFilters = selectedFilters.some(filter => {
        switch (filter) {
          case 'sale':
            return isProductOnSale(product)
          case 'new':
            return isProductNew(product)
          case 'featured':
            return isProductFeatured(product)
          default:
            return true
        }
      })
    }
    
    // Handle color filter
    let matchesColors = true
    if (selectedColors.length > 0 && product.colors && product.colors.length > 0) {
      matchesColors = selectedColors.some(color => 
        product.colors?.some(pc => 
          pc.toLowerCase().includes(color.toLowerCase()) || 
          color.toLowerCase().includes(pc.toLowerCase())
        )
      )
    }
    
    // Handle size filter
    let matchesSizes = true
    if (selectedSizes.length > 0 && product.availableSizes && product.availableSizes.length > 0) {
      matchesSizes = selectedSizes.some(size => 
        product.availableSizes?.includes(size)
      )
    }
    
    return matchesCategory && matchesSearch && matchesPrice && matchesSpecialFilters && matchesColors && matchesSizes
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price
      case 'Price: High to Low':
        return b.price - a.price
      case 'Newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'Best Rated':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the filter function
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range)
  }

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
    // Reset price range to backend values if available
    if (priceRange[1] > priceRange[0]) {
      // Keep current range, but reset to initial if needed
      const resetRange = async () => {
        try {
          const filterOptions = await apiClient.getFilterOptions()
          setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max])
        } catch (err) {
          console.error('Error fetching price range:', err)
        }
      }
      resetRange()
    }
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedFilters([])
    setSortBy('Featured')
  }

  const getGridCols = () => {
    switch (productsPerRow) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} onFilterClick={handleMobileFilterToggle} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} onFilterClick={handleMobileFilterToggle} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} onFilterClick={handleMobileFilterToggle} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">Discover our complete collection of luxury fashion</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <FiltersSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              colors={colors}
              selectedColors={selectedColors}
              onColorToggle={handleColorToggle}
              sizes={sizes}
              selectedSizes={selectedSizes}
              onSizeToggle={handleSizeToggle}
              selectedFilters={selectedFilters}
              onFilterToggle={handleFilterToggle}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {sortedProducts.length} products found
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </form>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                {/* View Options */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductsPerRow(1)}
                    className={`p-2 rounded ${productsPerRow === 1 ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Layout className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setProductsPerRow(2)}
                    className={`p-2 rounded ${productsPerRow === 2 ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setProductsPerRow(3)}
                    className={`p-2 rounded ${productsPerRow === 3 ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setProductsPerRow(4)}
                    className={`p-2 rounded ${productsPerRow === 4 ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ShoppingBag className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${getGridCols()} gap-6`}>
                {sortedProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group">
                    <div className="relative overflow-hidden rounded-t-lg aspect-[9/16]">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.images[0] || '/images/1.png'}
                          alt={product.name}
                          width={400}
                          height={711}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </Link>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isProductNew(product) && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            New
                          </span>
                        )}
                        {isProductOnSale(product) && (
                          <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                        <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-medium">{product.rating || 0}</span>
                        <span className="text-sm text-gray-400">({product.reviews || 0} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary-600">
                            ₨{typeof product.price === 'number' ? product.price.toLocaleString() : '0'}
                          </span>
                          {product.originalPrice && typeof product.originalPrice === 'number' && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₨{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200">
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleMenuClose} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <Sidebar
              isOpen={isMobileMenuOpen}
              onClose={handleMenuClose}
            />
          </div>
        </div>
      )}

      {/* Mobile Filters */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleFilterClose} />
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <MobileFilters
              isOpen={isMobileFiltersOpen}
              onClose={handleFilterClose}
            />
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}