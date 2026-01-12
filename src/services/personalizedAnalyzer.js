import { HEALTH_CONDITIONS } from '../data/healthConditions'

/**
 * Analyze product based on user's selected health conditions
 * @param {Object} product - Product data from Open Food Facts
 * @param {Array<string>} userConditions - Array of condition IDs user has selected
 * @returns {Object} Personalized analysis with warnings and score
 */
export function analyzeForConditions(product, userConditions = []) {
  if (!product.ingredients_text && !product.nutriments) {
    return {
      score: 0,
      warnings: [{ 
        ingredient: 'Unknown', 
        reason: 'Product information not available', 
        severity: 'medium',
        condition: 'general'
      }],
      recommendations: [],
      nutrientWarnings: []
    }
  }

  const warnings = []
  const nutrientWarnings = []
  const recommendations = new Set()
  let score = 100

  // If no conditions selected, use general health
  const conditions = userConditions.length > 0 
    ? userConditions 
    : ['generalHealth']

  const ingredientsLower = product.ingredients_text?.toLowerCase() || ''

  // Check each selected condition
  conditions.forEach(conditionId => {
    const condition = HEALTH_CONDITIONS[conditionId]
    if (!condition) return

    // Add recommendations
    condition.recommendations.forEach(rec => recommendations.add(rec))

    // Check for problematic ingredients
    condition.avoidIngredients.forEach(ingredient => {
      if (ingredientsLower.includes(ingredient.toLowerCase())) {
        warnings.push({
          ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
          reason: `Avoid with ${condition.name}`,
          severity: conditionId === 'cancer' || conditionId === 'celiac' ? 'high' : 'medium',
          condition: condition.name,
          icon: condition.icon
        })
        
        // Deduct points based on condition severity
        const deduction = conditionId === 'cancer' || conditionId === 'celiac' ? 25 : 15
        score -= deduction
      }
    })

    // Check nutrient limits
    if (product.nutriments) {
      Object.entries(condition.nutrientLimits).forEach(([nutrient, limit]) => {
        const value = product.nutriments[nutrient]
        if (value && value > limit.max) {
          nutrientWarnings.push({
            nutrient: limit.label,
            value: value,
            limit: limit.max,
            unit: limit.unit,
            condition: condition.name,
            icon: condition.icon
          })
          score -= 10
        }
      })
    }
  })

  // Ensure score doesn't go below 0
  score = Math.max(0, score)

  return {
    score,
    warnings: [...new Map(warnings.map(w => [w.ingredient, w])).values()], // Remove duplicates
    nutrientWarnings,
    recommendations: Array.from(recommendations)
  }
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity) {
  const colors = {
    high: '#ff0844',
    medium: '#ff8c00',
    low: '#ffd700'
  }
  return colors[severity] || colors.medium
}

/**
 * Get score classification
 */
export function getScoreClass(score) {
  if (score >= 80) return { class: 'good', label: 'Good Choice', color: '#38ef7d' }
  if (score >= 50) return { class: 'moderate', label: 'Use Caution', color: '#f5576c' }
  return { class: 'poor', label: 'Not Recommended', color: '#ff0844' }
}
