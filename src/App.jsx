import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import ProductInfo from './components/ProductInfo'
import BarcodeScanner from './components/BarcodeScanner'
import ErrorBoundary from './components/ErrorBoundary'
import { validateBarcode } from './utils/barcodeValidator'
import './App.css'

function App() {
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const debounceTimerRef = useRef(null)

  const handleScanSuccess = (barcodeValue) => {
    setScannedProduct({ barcode: barcodeValue })
    setBarcode('')
    setShowScanner(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanBarcode = barcode.trim()
    
    if (!cleanBarcode) {
      setValidationError('Please enter a barcode')
      return
    }

    // Validate barcode
    const validation = validateBarcode(cleanBarcode)
    if (!validation.isValid) {
      setValidationError(validation.message)
      return
    }

    setValidationError(null)
    handleScanSuccess(cleanBarcode)
  }

  // Debounced barcode input handler
  const handleBarcodeInput = (value) => {
    setBarcode(value)
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Clear validation error immediately if input is empty
    if (!value.trim()) {
      setValidationError(null)
      return
    }

    // Debounce validation by 500ms
    debounceTimerRef.current = setTimeout(() => {
      const validation = validateBarcode(value.trim())
      if (!validation.isValid) {
        setValidationError(validation.message)
      } else {
        setValidationError(null)
      }
    }, 500)
  }

  const handleScanAgain = () => {
    setScannedProduct(null)
    setBarcode('')
    setValidationError(null)
    setShowScanner(false)
  }

  const handleCancelScanner = () => {
    setShowScanner(false)
  }

  const handleErrorReset = () => {
    setScannedProduct(null)
    setBarcode('')
    setValidationError(null)
    setShowScanner(false)
  }

  return (
    <ErrorBoundary onReset={handleErrorReset}>
      <div className="app">
        <header className="app-header">
          <h1>🔍 LulaLens</h1>
          <p className="tagline">Scan & Discover Product Information</p>
        </header>

        <main className="app-main" role="main">
          {!scannedProduct && !showScanner && (
            <div className="welcome">
              <h2>Scan Product Barcode</h2>
              <p>Get instant product information and nutrition facts</p>
              
              <button 
                onClick={() => setShowScanner(true)} 
                className="camera-scan-button"
                aria-label="Open camera to scan barcode"
              >
                📷 Scan with Camera
              </button>

              <div className="divider" role="separator" aria-label="or">
                <span>OR</span>
              </div>
              
              <form onSubmit={handleSubmit} className="barcode-form">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => handleBarcodeInput(e.target.value)}
                  placeholder="Enter barcode manually"
                  className="barcode-input-main"
                  inputMode="numeric"
                  aria-label="Manual barcode input"
                  aria-describedby={validationError ? "barcode-validation-error" : undefined}
                  aria-invalid={validationError ? "true" : "false"}
                />
                {validationError && (
                  <div 
                    id="barcode-validation-error"
                    className="validation-error"
                    role="alert"
                  >
                    {validationError}
                  </div>
                )}
                <button 
                  type="submit" 
                  className="scan-button"
                  aria-label="Look up product by barcode"
                >
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

      <footer className="app-footer" role="contentinfo">
        <p>Powered by Open Food Facts</p>
      </footer>
    </div>
    </ErrorBoundary>
  )
}

export default App
