import { useState, useEffect } from 'react'
import ProductInfo from './components/ProductInfo'
import ConditionSelector from './components/ConditionSelector'
import BarcodeScanner from './components/BarcodeScanner'
import './App.css'

function App() {
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [userConditions, setUserConditions] = useState(() => {
    const saved = localStorage.getItem('lulaLensConditions')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('lulaLensConditions', JSON.stringify(userConditions))
  }, [userConditions])

  const handleScanSuccess = (barcodeValue) => {
    setScannedProduct({ barcode: barcodeValue })
    setBarcode('')
    setShowScanner(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (barcode.trim()) {
      handleScanSuccess(barcode.trim())
    }
  }

  const handleScanAgain = () => {
    setScannedProduct(null)
    setBarcode('')
    setShowScanner(false)
  }

  const handleCancelScanner = () => {
    setShowScanner(false)
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
        {!scannedProduct && !showScanner && (
          <div className="welcome">
            <h2>Scan or enter a product barcode</h2>
            <p>Identify seed oils, preservatives, and problematic additives</p>
            
            <button onClick={() => setShowScanner(true)} className="camera-scan-button">
              📷 Use Camera to Scan Barcode
            </button>

            <div className="divider">
              <span>OR</span>
            </div>
            
            <form onSubmit={handleSubmit} className="barcode-form">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter barcode manually (e.g., 737628064502)"
                className="barcode-input-main"
              />
              <button type="submit" className="scan-button">
                Analyze Product
              </button>
            </form>
          </div>
        )}

        {!scannedProduct && showScanner && (
          <BarcodeScanner 
            onScanSuccess={handleScanSuccess}
            onCancel={handleCancelScanner}
          />
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
        <p>Powered by Open Food Facts</p>
      </footer>
    </div>
  )
}

export default App
