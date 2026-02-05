import Cache from '../utils/cache.js'

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const REQUEST_TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

// Create cache instance
const cache = new Cache()

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, code, details) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.details = details
  }
}

/**
 * Check network connectivity
 */
function isOnline() {
  return navigator.onLine
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 'TIMEOUT', { url })
    }
    throw error
  }
}

/**
 * Exponential backoff retry logic
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, options)
    } catch (error) {
      lastError = error

      // Don't retry on timeout or if offline
      if (error.code === 'TIMEOUT' || !isOnline()) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === retries) {
        break
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new APIError(
    'Failed to fetch after retries',
    'MAX_RETRIES_EXCEEDED',
    { originalError: lastError }
  )
}

/**
 * Fetch product information from Open Food Facts by barcode
 * @param {string} barcode - The product barcode (UPC/EAN)
 * @returns {Promise<Object>} Product data
 */
export async function fetchProductByBarcode(barcode) {
  // Check if offline
  if (!isOnline()) {
    throw new APIError(
      'No internet connection. Please check your network.',
      'OFFLINE'
    )
  }

  // Check cache first
  const cacheKey = `product_${barcode}`
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/product/${barcode}.json`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new APIError(
          'Product not found in database',
          'NOT_FOUND',
          { barcode }
        )
      }
      throw new APIError(
        `Server error: ${response.status}`,
        'SERVER_ERROR',
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    if (data.status === 0) {
      throw new APIError(
        'Product not found in database',
        'NOT_FOUND',
        { barcode }
      )
    }
    
    // Cache the successful response
    cache.set(cacheKey, data, CACHE_TTL)
    
    return data
  } catch (error) {
    // Re-throw APIErrors as-is
    if (error instanceof APIError) {
      throw error
    }
    
    // Wrap other errors
    throw new APIError(
      error.message || 'Failed to fetch product',
      'FETCH_ERROR',
      { originalError: error }
    )
  }
}

/**
 * Search for products by name
 * @param {string} searchTerm - The search term
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export async function searchProducts(searchTerm, page = 1) {
  // Check if offline
  if (!isOnline()) {
    throw new APIError(
      'No internet connection. Please check your network.',
      'OFFLINE'
    )
  }

  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/search?search_terms=${encodeURIComponent(searchTerm)}&page=${page}&page_size=20&json=true`
    )
    
    if (!response.ok) {
      throw new APIError(
        `Server error: ${response.status}`,
        'SERVER_ERROR',
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Re-throw APIErrors as-is
    if (error instanceof APIError) {
      throw error
    }
    
    // Wrap other errors
    throw new APIError(
      error.message || 'Failed to search products',
      'FETCH_ERROR',
      { originalError: error }
    )
  }
}
