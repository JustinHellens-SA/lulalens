/**
 * Barcode validation utilities
 * Supports EAN-13, EAN-8, UPC-A, and UPC-E formats
 */

/**
 * Validate EAN-13 barcode
 * @param {string} barcode - 13-digit barcode
 * @returns {boolean} True if valid
 */
function validateEAN13(barcode) {
  if (!/^\d{13}$/.test(barcode)) return false
  
  const checkDigit = parseInt(barcode[12], 10)
  let sum = 0
  
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i], 10)
    // For EAN-13: multiply by 1 for even positions (0,2,4...) and by 3 for odd positions (1,3,5...)
    sum += (i % 2 === 0) ? digit : digit * 3
  }
  
  const calculatedCheck = (10 - (sum % 10)) % 10
  
  return checkDigit === calculatedCheck
}

/**
 * Validate EAN-8 barcode
 * @param {string} barcode - 8-digit barcode
 * @returns {boolean} True if valid
 */
function validateEAN8(barcode) {
  if (!/^\d{8}$/.test(barcode)) return false
  
  const checkDigit = parseInt(barcode[7], 10)
  let sum = 0
  
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(barcode[i], 10)
    // For EAN-8: multiply by 3 for even positions (0,2,4,6) and by 1 for odd positions (1,3,5)
    sum += (i % 2 === 0) ? digit * 3 : digit
  }
  
  const calculatedCheck = (10 - (sum % 10)) % 10
  
  return checkDigit === calculatedCheck
}

/**
 * Validate UPC-A barcode (12 digits)
 * @param {string} barcode - 12-digit barcode
 * @returns {boolean} True if valid
 */
function validateUPCA(barcode) {
  if (!/^\d{12}$/.test(barcode)) return false
  
  let sum = 0
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(barcode[i], 10)
    // Multiply odd positions (1-indexed) by 3
    sum += (i % 2 === 0) ? digit * 3 : digit
  }
  
  const checkDigit = parseInt(barcode[11], 10)
  const calculatedCheck = (10 - (sum % 10)) % 10
  
  return checkDigit === calculatedCheck
}

/**
 * Validate UPC-E barcode (6, 7, or 8 digits)
 * Note: This performs basic length validation only.
 * Full UPC-E validation requires expansion to UPC-A format.
 * @param {string} barcode - UPC-E barcode
 * @returns {boolean} True if basic format is valid
 */
function validateUPCE(barcode) {
  // UPC-E can be 6, 7, or 8 digits (with system and check digits)
  // For simplicity, accept 6-8 digit numeric codes as potentially valid
  // Full UPC-E validation would require expansion to UPC-A
  if (!/^\d{6,8}$/.test(barcode)) return false
  
  return true
}

/**
 * Detect barcode format
 * @param {string} barcode - Barcode string
 * @returns {string|null} Format name or null if invalid
 */
export function detectBarcodeFormat(barcode) {
  const cleaned = barcode.trim()
  
  if (validateEAN13(cleaned)) return 'EAN-13'
  if (validateEAN8(cleaned)) return 'EAN-8'
  if (validateUPCA(cleaned)) return 'UPC-A'
  if (validateUPCE(cleaned)) return 'UPC-E'
  
  return null
}

/**
 * Validate barcode format
 * @param {string} barcode - Barcode to validate
 * @returns {Object} Validation result with isValid, format, and message
 */
export function validateBarcode(barcode) {
  if (!barcode || typeof barcode !== 'string') {
    return {
      isValid: false,
      format: null,
      message: 'Barcode is required'
    }
  }

  const cleaned = barcode.trim()

  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      format: null,
      message: 'Barcode must contain only numbers'
    }
  }

  const format = detectBarcodeFormat(cleaned)

  if (!format) {
    // Provide helpful feedback based on length
    if (cleaned.length < 6) {
      return {
        isValid: false,
        format: null,
        message: 'Barcode is too short. Expected 8, 12, or 13 digits.'
      }
    } else if (cleaned.length > 13) {
      return {
        isValid: false,
        format: null,
        message: 'Barcode is too long. Expected 8, 12, or 13 digits.'
      }
    } else {
      return {
        isValid: false,
        format: null,
        message: 'Invalid barcode. Check digit verification failed.'
      }
    }
  }

  return {
    isValid: true,
    format,
    message: `Valid ${format} barcode`
  }
}
