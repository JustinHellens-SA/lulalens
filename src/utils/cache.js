/**
 * Simple in-memory cache with TTL (Time To Live)
 */
class Cache {
  constructor() {
    this.cache = new Map()
  }

  /**
   * Set a value in cache with TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl) {
    const expiresAt = Date.now() + ttl
    this.cache.set(key, { value, expiresAt })
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

export default Cache
