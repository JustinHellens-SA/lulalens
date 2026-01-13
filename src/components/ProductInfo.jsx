import { useState, useEffect } from 'react'
import { fetchProductByBarcode } from '../services/openFoodFactsApi'
import './ProductInfo.css'

function ProductInfo({ product, onScanAgain }) {
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          <h3>📊 Nutrition Facts (per 100g)</h3>
          <div className="nutrition-grid">
            {(prod.nutriments.energy_100g || prod.nutriments['energy-kj_100g'] || prod.nutriments.energy) ? (
              <div className="nutrition-item">
                <span className="label">Energy</span>
                <span className="value">
                  {Math.round(prod.nutriments.energy_100g || prod.nutriments['energy-kj_100g'] || prod.nutriments.energy || 0)} kJ
                </span>
              </div>
            ) : null}
            {(prod.nutriments['energy-kcal_100g'] || prod.nutriments['energy-kcal']) ? (
              <div className="nutrition-item">
                <span className="label">Calories</span>
                <span className="value">
                  {Math.round(prod.nutriments['energy-kcal_100g'] || prod.nutriments['energy-kcal'] || 0)} kcal
                </span>
              </div>
            ) : null}
            {(prod.nutriments.fat_100g != null || prod.nutriments.fat != null) ? (
              <div className="nutrition-item">
                <span className="label">Fat</span>
                <span className="value">
                  {Number(prod.nutriments.fat_100g ?? prod.nutriments.fat ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments['saturated-fat_100g'] != null || prod.nutriments['saturated-fat'] != null) ? (
              <div className="nutrition-item sub">
                <span className="label">Saturated Fat</span>
                <span className="value">
                  {Number(prod.nutriments['saturated-fat_100g'] ?? prod.nutriments['saturated-fat'] ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.carbohydrates_100g != null || prod.nutriments.carbohydrates != null) ? (
              <div className="nutrition-item">
                <span className="label">Carbohydrates</span>
                <span className="value">
                  {Number(prod.nutriments.carbohydrates_100g ?? prod.nutriments.carbohydrates ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.sugars_100g != null || prod.nutriments.sugars != null) ? (
              <div className="nutrition-item sub">
                <span className="label">Sugars</span>
                <span className="value">
                  {Number(prod.nutriments.sugars_100g ?? prod.nutriments.sugars ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.fiber_100g != null || prod.nutriments.fiber != null) ? (
              <div className="nutrition-item">
                <span className="label">Fiber</span>
                <span className="value">
                  {Number(prod.nutriments.fiber_100g ?? prod.nutriments.fiber ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.proteins_100g != null || prod.nutriments.proteins != null) ? (
              <div className="nutrition-item">
                <span className="label">Protein</span>
                <span className="value">
                  {Number(prod.nutriments.proteins_100g ?? prod.nutriments.proteins ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.salt_100g != null || prod.nutriments.salt != null) ? (
              <div className="nutrition-item">
                <span className="label">Salt</span>
                <span className="value">
                  {Number(prod.nutriments.salt_100g ?? prod.nutriments.salt ?? 0).toFixed(1)} g
                </span>
              </div>
            ) : null}
            {(prod.nutriments.sodium_100g != null || prod.nutriments.sodium != null) ? (
              <div className="nutrition-item sub">
                <span className="label">Sodium</span>
                <span className="value">
                  {Number(prod.nutriments.sodium_100g ?? prod.nutriments.sodium ?? 0).toFixed(3)} g
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
