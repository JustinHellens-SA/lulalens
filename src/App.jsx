import { useState, useEffect } from 'react'
import ProductInfo from './components/ProductInfo'
import ConditionSelector from './components/ConditionSelector'
import './App.css'

function App() {
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [userConditions, setUserConditions] = useState(() => {
    const saved = localStorage.getItem('lulaLensConditions')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('lulaLensConditions', JSON.stringify(userConditions))
  }, [userConditions])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (barcode.trim()) {
      setScannedProduct({ barcode: barcode.trim() })
      setBarcode('')
    }
  }

  const handleScanAgain = () => {
    setScannedProduct(null)
    setBarcode('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔍 LulaLens</h1>
        <p className="tagline">Personalized Food Analysis</p>
        <ConditionSelector 
          selectedConditions={userConditions}
          onConditionsChange={setUserConditions}
        />
      </header>

      <main className="app-main">
        {!scannedProduct && (
          <div className="welcome">
            <h2>Enter Product Barcode</h2>
            <p>Identify seed oils, preservatives, and problematic additives</p>
            
            <form onSubmit={handleSubmit} className="barcode-form">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter barcode (e.g., 737628064502)"
                className="barcode-input-main"
                autoFocus
                inputMode="numeric"
              />
              <button type="submit" className="scan-button">
                🔍 Analyze Product
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              color: '#666',
              fontSize: '14px',
              maxWidth: '400px',
              margin: '20px auto'
            }}>
              <p>💡 Find the barcode on product packaging</p>
              <p>Usually 8-13 digits under the barcode lines</p>
            </div>
          </div>
        )}

        {scannedProduct && (
          <ProductInfo 
            product={scannedProduct}
            onScanAgain={handleScanAgain}
            userConditions={userConditions}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Justin Hellens</p>
      </footer>
    </div>
  )
}

export default App
