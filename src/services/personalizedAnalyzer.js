import { HEALTH_CONDITIONS, SEVERITY } from '../data/healthConditions'

/**
 * Analyze product based on user's selected health conditions with severity levels
 * @param {Object} product - Product data from Open Food Facts
 * @param {Array<string>} userConditions - Array of condition IDs user has selected
 * @returns {Object} Personalized analysis with warnings, positive findings, and score
 */
export function analyzeForConditions(product, userConditions = []) {
  if (!product.ingredients_text && !product.nutriments) {
    return {
      score: 0,
      warnings: [{ 
        ingredient: 'Unknown', 
        reason: 'Product information not available', 
        severity: 'high',
        condition: 'general',
        source: 'N/A'
      }],
      recommendations: [],
      nutrientWarnings: [],
      positiveFindings: []
    }
  }

  const warnings = []
  const nutrientWarnings = []
  const positiveFindings = []
  const recommendations = new Set()
  const sources = new Set()
  let score = 100

  // If no conditions selected, use general health
  const conditions = userConditions.length > 0 
    ? userConditions 
    : ['generalHealth']

  const ingredientsLower = product.ingredients_text?.toLowerCase() || ''
  
  // Debug logging
  console.log('🔍 Analyzing product ingredients:', product.ingredients_text)
  console.log('📋 User conditions:', conditions)
  
  // Helper function to check if an ingredient is present (more flexible matching)
  const containsIngredient = (text, searchTerm) => {
    const term = searchTerm.toLowerCase().trim()
    const textLower = text.toLowerCase()
    
    // Direct match
    if (textLower.includes(term)) return true
    
    // Try with word boundaries for more accurate matching
    const wordBoundaryRegex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (wordBoundaryRegex.test(text)) return true
    
    // Check for common variations (e.g., "palm oil" vs "palmoil")
    const noSpacesTerm = term.replace(/\s+/g, '')
    if (noSpacesTerm !== term && textLower.includes(noSpacesTerm)) return true
    
    return false
  }

  // Check each selected condition
  conditions.forEach(conditionId => {
    const condition = HEALTH_CONDITIONS[conditionId]
    if (!condition) return

    // Add sources
    if (condition.sources) {
      condition.sources.forEach(source => sources.add(source))
    }

    // Add recommendations
    condition.recommendations.forEach(rec => recommendations.add(rec))

    // Check for positive ingredients
    if (condition.positiveIngredients) {
      condition.positiveIngredients.forEach(positiveItem => {
        const itemName = typeof positiveItem === 'string' ? positiveItem : positiveItem.name
        if (containsIngredient(ingredientsLower, itemName)) {
          positiveFindings.push({
            ingredient: itemName,
            benefit: typeof positiveItem === 'object' ? positiveItem.benefit : 'Beneficial ingredient',
            condition: condition.name,
            icon: '✅'
          })
          // Bonus points for positive ingredients
          score += 5
        }
      })
    }

    // Check for problematic ingredients with severity levels
    condition.avoidIngredients.forEach(ingredient => {
      const ingredientData = typeof ingredient === 'string' 
        ? { name: ingredient, severity: SEVERITY.MODERATE, reason: `Avoid with ${condition.name}`, source: condition.name }
        : ingredient

      if (containsIngredient(ingredientsLower, ingredientData.name)) {
        warnings.push({
          ingredient: ingredientData.name.charAt(0).toUpperCase() + ingredientData.name.slice(1),
          reason: ingredientData.reason,
          severity: ingredientData.severity,
          condition: condition.name,
          icon: condition.icon,
          source: ingredientData.source
        })
        
        // Deduct points based on severity
        const deduction = ingredientData.severity === SEVERITY.CRITICAL ? 30 
                        : ingredientData.severity === SEVERITY.HIGH ? 20 
                        : 10
        score -= deduction
      }
    })

    // Check nutrient limits with reasons
    if (product.nutriments) {
      Object.entries(condition.nutrientLimits).forEach(([nutrient, limit]) => {
        const value = product.nutriments[nutrient]
        if (value && value > limit.max) {
          nutrientWarnings.push({
            nutrient: limit.label,
            value: value,
            limit: limit.max,
            unit: limit.unit,
            reason: limit.reason || `Exceeds recommended limit for ${condition.name}`,
            condition: condition.name,
            icon: condition.icon
          })
          score -= 10
        }
      })
    }
  })

  // Ensure score doesn't go below 0 or above 100
  score = Math.max(0, Math.min(100, score))

  return {
    score,
    warnings: warnings.sort((a, b) => {
      // Sort by severity: critical > high > moderate
      const severityOrder = { critical: 0, high: 1, moderate: 2 }
      return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3)
    }),
    nutrientWarnings,
    positiveFindings,
    recommendations: Array.from(recommendations),
    sources: Array.from(sources)
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
