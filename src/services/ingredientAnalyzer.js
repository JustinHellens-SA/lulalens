// List of problematic ingredients to flag
const PROBLEMATIC_INGREDIENTS = {
  // Seed oils (highly processed, inflammatory)
  seedOils: {
    keywords: [
      'canola oil', 'rapeseed oil', 'soybean oil', 'soy oil',
      'corn oil', 'cottonseed oil', 'safflower oil', 'sunflower oil',
      'grapeseed oil', 'rice bran oil', 'vegetable oil'
    ],
    severity: 'high',
    reason: 'Highly processed seed oil (inflammatory)'
  },
  
  // Preservatives
  preservatives: {
    keywords: [
      'sodium benzoate', 'potassium benzoate', 'calcium benzoate',
      'sodium nitrite', 'sodium nitrate', 'bha', 'bht',
      'tbhq', 'propyl gallate', 'sodium sulfite', 'sulfur dioxide'
    ],
    severity: 'medium',
    reason: 'Preservative (potential health concerns)'
  },
  
  // Artificial sweeteners
  artificialSweeteners: {
    keywords: [
      'aspartame', 'sucralose', 'saccharin', 'acesulfame',
      'neotame', 'advantame'
    ],
    severity: 'medium',
    reason: 'Artificial sweetener'
  },
  
  // Additives and emulsifiers
  additives: {
    keywords: [
      'monosodium glutamate', 'msg', 'carrageenan',
      'polysorbate 80', 'polysorbate 60',
      'sodium phosphate', 'disodium phosphate',
      'propylene glycol', 'artificial flavor', 'artificial colour'
    ],
    severity: 'medium',
    reason: 'Additive or emulsifier'
  },
  
  // Trans fats
  transFats: {
    keywords: [
      'partially hydrogenated', 'hydrogenated oil',
      'trans fat', 'shortening'
    ],
    severity: 'high',
    reason: 'Trans fats (linked to heart disease)'
  },
  
  // High fructose corn syrup
  hfcs: {
    keywords: [
      'high fructose corn syrup', 'hfcs', 'corn syrup',
      'glucose-fructose'
    ],
    severity: 'medium',
    reason: 'High fructose corn syrup'
  }
}

/**
 * Analyze product ingredients for problematic components
 * @param {Object} product - Product data from Open Food Facts
 * @returns {Object} Analysis results with warnings and score
 */
export function analyzeIngredients(product) {
  const warnings = []
  let score = 100
  
  if (!product.ingredients_text) {
    return {
      score: 0,
      warnings: [{ 
        ingredient: 'Unknown', 
        reason: 'Ingredient information not available', 
        severity: 'medium' 
      }]
    }
  }
  
  const ingredientsLower = product.ingredients_text.toLowerCase()
  
  // Check each category of problematic ingredients
  Object.entries(PROBLEMATIC_INGREDIENTS).forEach(([category, data]) => {
    data.keywords.forEach(keyword => {
      if (ingredientsLower.includes(keyword)) {
        warnings.push({
          ingredient: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          reason: data.reason,
          severity: data.severity
        })
        
        // Deduct points based on severity
        if (data.severity === 'high') {
          score -= 20
        } else if (data.severity === 'medium') {
          score -= 10
        } else {
          score -= 5
        }
      }
    })
  })
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score)
  
  return {
    score,
    warnings
  }
}

/**
 * Get a list of all flagged ingredients
 * @returns {Array<string>} List of ingredient keywords being flagged
 */
export function getFlaggedIngredients() {
  const allKeywords = []
  Object.values(PROBLEMATIC_INGREDIENTS).forEach(category => {
    allKeywords.push(...category.keywords)
  })
  return allKeywords
}

/**
 * Add custom ingredient to flag
 * @param {string} keyword - Ingredient keyword to flag
 * @param {string} reason - Reason for flagging
 * @param {string} severity - Severity level: 'high', 'medium', or 'low'
 */
export function addCustomIngredient(keyword, reason, severity = 'medium') {
  if (!PROBLEMATIC_INGREDIENTS.custom) {
    PROBLEMATIC_INGREDIENTS.custom = {
      keywords: [],
      severity: 'medium',
      reason: 'Custom flagged ingredient'
    }
  }
  
  if (!PROBLEMATIC_INGREDIENTS.custom.keywords.includes(keyword.toLowerCase())) {
    PROBLEMATIC_INGREDIENTS.custom.keywords.push(keyword.toLowerCase())
  }
}
