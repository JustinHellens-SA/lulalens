import { useState } from 'react'
import ProductInfo from './components/ProductInfo'
import BarcodeScanner from './components/BarcodeScanner'
import './App.css'

function App() {
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [showScanner, setShowScanner] = useState(false)

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
        <p className="tagline">Scan & Discover Product Information</p>
      </header>

      <main className="app-main">
        {!scannedProduct && !showScanner && (
          <div className="welcome">
            <h2>Scan Product Barcode</h2>
            <p>Get instant product information and nutrition facts</p>
            
            <button onClick={() => setShowScanner(true)} className="camera-scan-button">
              📷 Scan with Camera
            </button>

            <div className="divider">
              <span>OR</span>
            </div>
            
            <form onSubmit={handleSubmit} className="barcode-form">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter barcode manually"
                className="barcode-input-main"
                inputMode="numeric"
              />
              <button type="submit" className="scan-button">
                Look Up Product
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
