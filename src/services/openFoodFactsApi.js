const API_BASE_URL = 'https://world.openfoodfacts.org/api/v2'

/**
 * Fetch product information from Open Food Facts by barcode
 * @param {string} barcode - The product barcode (UPC/EAN)
 * @returns {Promise<Object>} Product data
 */
export async function fetchProductByBarcode(barcode) {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${barcode}.json`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status === 0) {
      throw new Error('Product not found')
    }
    
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

/**
 * Search for products by name
 * @param {string} searchTerm - The search term
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export async function searchProducts(searchTerm, page = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?search_terms=${encodeURIComponent(searchTerm)}&page=${page}&page_size=20&json=true`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}
