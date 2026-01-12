import { useState, useEffect } from 'react'
import { fetchProductByBarcode } from '../services/openFoodFactsApi'
import { analyzeForConditions, getScoreClass } from '../services/personalizedAnalyzer'
import './ProductInfo.css'

function ProductInfo({ product, onScanAgain, userConditions = [] }) {
  const [productData, setProductData] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchProductByBarcode(product.barcode)
        setProductData(data)
        
        if (data && data.product) {
          const ingredientAnalysis = analyzeForConditions(data.product, userConditions)
          setAnalysis(ingredientAnalysis)
        }
        
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
  const safetyScore = analysis ? analysis.score : 0
  const scoreInfo = getScoreClass(safetyScore)

  return (
    <div className="product-info">
      <div className="product-header">
        {prod.image_url && (
          <img src={prod.image_url} alt={prod.product_name} className="product-image" />
        )}
        <div className="product-title">
          <h2>{prod.product_name || 'Unknown Product'}</h2>
          {prod.brands && <p className="brand">{prod.brands}</p>}
        </div>
      </div>

      <div className={`safety-score ${scoreInfo.class}`}>
        <h3>Safety Score</h3>
        <div className="score-value">{safetyScore}/100</div>
        <div className="score-label" style={{ color: scoreInfo.color }}>
          {scoreInfo.label}
        </div>
      </div>

      {userConditions.length > 0 && (
        <div className="active-conditions">
          <p>📋 Analyzing for: {userConditions.map(c => c.replace(/([A-Z])/g, ' $1').trim()).join(', ')}</p>
        </div>
      )}

      {/* Positive Findings - Show what's GOOD */}
      {analysis && analysis.positiveFindings && analysis.positiveFindings.length > 0 && (
        <div className="positive-findings">
          <h3>✅ Good News!</h3>
          <ul>
            {analysis.positiveFindings.map((finding, index) => (
              <li key={index} className="positive-item">
                <span className="positive-icon">{finding.icon}</span>
                <div className="positive-content">
                  <strong>{finding.ingredient}</strong>
                  <span className="positive-benefit">{finding.benefit}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis && analysis.warnings.length > 0 && (
        <div className="warnings">
          <h3>⚠️ Ingredient Warnings</h3>
          <ul>
            {analysis.warnings.map((warning, index) => (
              <li key={index} className={`warning-${warning.severity}`}>
                <span className="warning-icon">{warning.icon}</span>
                <div className="warning-content">
                  <strong>{warning.ingredient}</strong>
                  <span className="warning-reason">{warning.reason}</span>
                  {warning.source && (
                    <span className="warning-source">Source: {warning.source}</span>
                  )}
                  {warning.severity === 'critical' && (
                    <span className="severity-badge critical">⛔ AVOID COMPLETELY</span>
                  )}
                  {warning.severity === 'high' && (
                    <span className="severity-badge high">🚨 LIMIT STRICTLY</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis && analysis.nutrientWarnings.length > 0 && (
        <div className="nutrient-warnings">
          <h3>📊 Nutrient Alerts</h3>
          <ul>
            {analysis.nutrientWarnings.map((warning, index) => (
              <li key={index}>
                <span className="warning-icon">{warning.icon}</span>
                <div className="nutrient-content">
                  <strong>{warning.nutrient}:</strong> {warning.value.toFixed(1)}{warning.unit}
                  <span className="nutrient-limit">(Limit: {warning.limit}{warning.unit})</span>
                  {warning.reason && (
                    <span className="nutrient-reason">{warning.reason}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis && analysis.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>💡 Recommendations</h3>
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence-based Sources */}
      {analysis && analysis.sources && analysis.sources.length > 0 && (
        <div className="sources-section">
          <h3>📚 Evidence-Based Sources</h3>
          <ul className="sources-list">
            {analysis.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      )}

      {prod.ingredients_text && (
        <div className="ingredients-section">
          <h3>Ingredients</h3>
          <p className="ingredients-text">{prod.ingredients_text}</p>
        </div>
      )}

      {prod.nutriments && (
        <div className="nutrition-section">
          <h3>Nutrition (per 100g)</h3>
          <div className="nutrition-grid">
            {prod.nutriments.energy && (
              <div className="nutrition-item">
                <span>Energy:</span>
                <span>{prod.nutriments.energy} kJ</span>
              </div>
            )}
            {prod.nutriments.fat && (
              <div className="nutrition-item">
                <span>Fat:</span>
                <span>{prod.nutriments.fat}g</span>
              </div>
            )}
            {prod.nutriments.carbohydrates && (
              <div className="nutrition-item">
                <span>Carbs:</span>
                <span>{prod.nutriments.carbohydrates}g</span>
              </div>
            )}
            {prod.nutriments.proteins && (
              <div className="nutrition-item">
                <span>Protein:</span>
                <span>{prod.nutriments.proteins}g</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="product-actions">
        <button onClick={onScanAgain} className="scan-again-button">
          Scan Another Product
        </button>
      </div>
    </div>
  )
}

export default ProductInfo
