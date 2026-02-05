import { useState, useEffect } from 'react'
import { fetchProductByBarcode } from '../services/openFoodFactsApi'
import './ProductInfo.css'

function ProductInfo({ product, onScanAgain }) {
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPerServing, setShowPerServing] = useState(false)

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchProductByBarcode(product.barcode)
        setProductData(data)
        setLoading(false)
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Unable to find product information')
        setLoading(false)
      }
    }

    loadProductData()
  }, [product.barcode])

  if (loading) {
    return (
      <div className="product-info">
        <div className="loading">
          <p>Loading product information...</p>
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (error || !productData || !productData.product) {
    return (
      <div className="product-info">
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>Barcode: {product.barcode}</p>
          <p>{error || 'This product is not in the database yet.'}</p>
          <button onClick={onScanAgain}>Scan Another Product</button>
        </div>
      </div>
    )
  }

  const prod = productData.product
  
  // Debug log to see what data we have
  console.log('Product data:', prod)
  console.log('Nutriments:', prod.nutriments)

  // Helper function to get nutrient value (per 100g or per serving)
  const getNutrientValue = (nutrient, suffix = '_100g', fallbackSuffix = '') => {
    if (!prod.nutriments) return null
    
    const per100g = prod.nutriments[`${nutrient}${suffix}`] ?? prod.nutriments[`${nutrient}${fallbackSuffix}`]
    
    if (per100g == null) return null
    
    if (showPerServing && prod.serving_quantity) {
      return per100g * prod.serving_quantity / 100
    }
    
    return per100g
  }

  // Helper function to format nutrient display
  const formatNutrient = (value, decimals = 1) => {
    if (value == null) return null
    return Number(value).toFixed(decimals)
  }

  // Check if serving size data is available
  const hasServingData = prod.serving_size || prod.serving_quantity

  return (
    <div className="product-info">
      <div className="product-header">
        {prod.image_url && (
          <img src={prod.image_url} alt={prod.product_name} className="product-image" />
        )}
        <div className="product-title">
          <h2>{prod.product_name || 'Unknown Product'}</h2>
          {prod.brands && <p className="brand">{prod.brands}</p>}
          {prod.quantity && <p className="quantity">{prod.quantity}</p>}
        </div>
      </div>

      {/* Nutrition Facts */}
      {prod.nutriments && Object.keys(prod.nutriments).length > 0 ? (
        <div className="nutrition-section">
          <div className="nutrition-header">
            <h3>📊 Nutrition Facts</h3>
            {prod.nutrition_grades && (
              <div className={`nutrition-grade grade-${prod.nutrition_grades.toLowerCase()}`}>
                Nutri-Score: {prod.nutrition_grades.toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="serving-toggle-section">
            <div className="serving-info">
              <span className="serving-label">
                {showPerServing 
                  ? `Per Serving${prod.serving_size ? ` (${prod.serving_size})` : ''}`
                  : 'Per 100g'
                }
              </span>
              {hasServingData && (
                <button 
                  className="toggle-serving-button"
                  onClick={() => setShowPerServing(!showPerServing)}
                >
                  Switch to {showPerServing ? 'per 100g' : 'per serving'}
                </button>
              )}
            </div>
          </div>

          <div className="nutrition-grid">
            {/* Energy Section */}
            {(prod.nutriments.energy_100g || prod.nutriments['energy-kj_100g'] || prod.nutriments.energy) ? (
              <div className="nutrition-item">
                <span className="label">Energy</span>
                <span className="value">
                  {Math.round(getNutrientValue('energy', '_100g', '') || getNutrientValue('energy-kj', '_100g', '') || 0)} kJ
                </span>
              </div>
            ) : null}
            {(prod.nutriments['energy-kcal_100g'] || prod.nutriments['energy-kcal']) ? (
              <div className="nutrition-item">
                <span className="label">Calories</span>
                <span className="value">
                  {Math.round(getNutrientValue('energy-kcal', '_100g', '') || 0)} kcal
                </span>
              </div>
            ) : null}

            {/* Fats Section */}
            {(prod.nutriments.fat_100g != null || prod.nutriments.fat != null) ? (
              <>
                <div className="nutrition-item">
                  <span className="label">Fat</span>
                  <span className="value">
                    {formatNutrient(getNutrientValue('fat', '_100g', ''))} g
                  </span>
                </div>
                {(prod.nutriments['saturated-fat_100g'] != null || prod.nutriments['saturated-fat'] != null) ? (
                  <div className="nutrition-item sub">
                    <span className="label">Saturated Fat</span>
                    <span className="value">
                      {formatNutrient(getNutrientValue('saturated-fat', '_100g', ''))} g
                    </span>
                  </div>
                ) : null}
                {(prod.nutriments['trans-fat_100g'] != null || prod.nutriments['trans-fat'] != null) ? (
                  <div className="nutrition-item sub">
                    <span className="label">Trans Fat</span>
                    <span className="value">
                      {formatNutrient(getNutrientValue('trans-fat', '_100g', ''))} g
                    </span>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* Cholesterol */}
            {(prod.nutriments.cholesterol_100g != null || prod.nutriments.cholesterol != null) ? (
              <div className="nutrition-item">
                <span className="label">Cholesterol</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('cholesterol', '_100g', ''), 1)} mg
                </span>
              </div>
            ) : null}

            {/* Carbohydrates Section */}
            {(prod.nutriments.carbohydrates_100g != null || prod.nutriments.carbohydrates != null) ? (
              <>
                <div className="nutrition-item">
                  <span className="label">Carbohydrates</span>
                  <span className="value">
                    {formatNutrient(getNutrientValue('carbohydrates', '_100g', ''))} g
                  </span>
                </div>
                {(prod.nutriments.sugars_100g != null || prod.nutriments.sugars != null) ? (
                  <div className="nutrition-item sub">
                    <span className="label">Sugars</span>
                    <span className="value">
                      {formatNutrient(getNutrientValue('sugars', '_100g', ''))} g
                    </span>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* Fiber */}
            {(prod.nutriments.fiber_100g != null || prod.nutriments.fiber != null) ? (
              <div className="nutrition-item">
                <span className="label">Fiber</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('fiber', '_100g', ''))} g
                </span>
              </div>
            ) : null}

            {/* Protein */}
            {(prod.nutriments.proteins_100g != null || prod.nutriments.proteins != null) ? (
              <div className="nutrition-item">
                <span className="label">Protein</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('proteins', '_100g', ''))} g
                </span>
              </div>
            ) : null}

            {/* Salt and Sodium */}
            {(prod.nutriments.salt_100g != null || prod.nutriments.salt != null) ? (
              <div className="nutrition-item">
                <span className="label">Salt</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('salt', '_100g', ''))} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.sodium_100g != null || prod.nutriments.sodium != null) ? (
              <div className="nutrition-item sub">
                <span className="label">Sodium</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('sodium', '_100g', ''), 3)} g
                </span>
              </div>
            ) : null}

            {/* Vitamins Section */}
            {(prod.nutriments['vitamin-a_100g'] != null || prod.nutriments['vitamin-a'] != null) ? (
              <div className="nutrition-item vitamin">
                <span className="label">Vitamin A</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('vitamin-a', '_100g', ''), 3)} mg
                </span>
              </div>
            ) : null}
            {(prod.nutriments['vitamin-c_100g'] != null || prod.nutriments['vitamin-c'] != null) ? (
              <div className="nutrition-item vitamin">
                <span className="label">Vitamin C</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('vitamin-c', '_100g', ''), 3)} mg
                </span>
              </div>
            ) : null}

            {/* Minerals Section */}
            {(prod.nutriments.calcium_100g != null || prod.nutriments.calcium != null) ? (
              <div className="nutrition-item mineral">
                <span className="label">Calcium</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('calcium', '_100g', ''), 3)} mg
                </span>
              </div>
            ) : null}
            {(prod.nutriments.iron_100g != null || prod.nutriments.iron != null) ? (
              <div className="nutrition-item mineral">
                <span className="label">Iron</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('iron', '_100g', ''), 3)} mg
                </span>
              </div>
            ) : null}
            {(prod.nutriments.potassium_100g != null || prod.nutriments.potassium != null) ? (
              <div className="nutrition-item mineral">
                <span className="label">Potassium</span>
                <span className="value">
                  {formatNutrient(getNutrientValue('potassium', '_100g', ''), 3)} mg
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="nutrition-section">
          <h3>📊 Nutrition Facts</h3>
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            Nutrition information not available for this product.
          </p>
        </div>
      )}

      {/* Ingredients */}
      {prod.ingredients_text && (
        <div className="ingredients-section">
          <h3>🧪 Ingredients</h3>
          <p className="ingredients-text">{prod.ingredients_text}</p>
        </div>
      )}

      {/* Allergens */}
      {prod.allergens && (
        <div className="allergens-section">
          <h3>⚠️ Allergens</h3>
          <p>{prod.allergens}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="additional-info">
        {prod.categories && (
          <div className="info-item">
            <strong>Categories:</strong> {prod.categories}
          </div>
        )}
        {prod.labels && (
          <div className="info-item">
            <strong>Labels:</strong> {prod.labels}
          </div>
        )}
        {prod.origins && (
          <div className="info-item">
            <strong>Origins:</strong> {prod.origins}
          </div>
        )}
        {prod.manufacturing_places && (
          <div className="info-item">
            <strong>Manufacturing:</strong> {prod.manufacturing_places}
          </div>
        )}
      </div>

      <div className="scan-again-section">
        <button onClick={onScanAgain} className="scan-again-button">
          Scan Another Product
        </button>
      </div>
    </div>
  )
}

export default ProductInfo
