import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const isStartingRef = useRef(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const startScanner = async () => {
      if (isStartingRef.current) {
        console.log('Scanner already starting...')
        return
      }

      try {
        isStartingRef.current = true
        setIsInitializing(true)
        setDebugInfo('Checking camera availability...')
        console.log('Starting scanner initialization...')

        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access not supported. Use manual entry below.')
        }

        setDebugInfo('Requesting camera access...')
        console.log('Requesting camera permissions...')

        // Set a timeout that will show manual entry
        timeoutRef.current = setTimeout(() => {
          console.error('Scanner initialization timeout - showing manual entry')
          setIsInitializing(false)
          setShowManualEntry(true)
          setDebugInfo('Taking too long? Use manual entry below')
        }, 5000) // Reduced to 5 seconds

        const html5QrCode = new Html5Qrcode("barcode-reader")
        html5QrCodeRef.current = html5QrCode

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }

        console.log('Starting html5-qrcode...')
        
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            console.log('Barcode scanned:', decodedText)
            if (html5QrCodeRef.current) {
              html5QrCodeRef.current.stop().catch(err => console.error('Error stopping:', err))
            }
            onScanSuccess(decodedText)
          },
          (errorMessage) => {
            // Scanning errors (can be ignored - these happen constantly while scanning)
          }
        )
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        console.log('Scanner started successfully')
        setDebugInfo('Scanner ready - point at barcode')
        setIsInitializing(false)
        isStartingRef.current = false
      } catch (err) {
        console.error("Error starting scanner:", err)
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        let errorMsg = "Unable to access camera. "
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg += "Camera permission denied. Please allow camera access and refresh."
        } else if (err.name === 'NotFoundError') {
          errorMsg += "No camera found on this device."
        } else if (err.name === 'NotReadableError') {
          errorMsg += "Camera is already in use."
        } else if (err.name === 'NotSupportedError') {
          errorMsg += "Camera not supported on this device."
        } else {
          errorMsg += err.message || "Use manual entry below."
        }
        
        setError(errorMsg)
        setDebugInfo('')
        setIsInitializing(false)
        setShowManualEntry(true)
        isStartingRef.current = false
      }
    }

    startScanner()

    return () => {
      isStartingRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner:", err))
      }
    }
  }, [onScanSuccess])

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner:", err))
    }
    onCancel()
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim())
    }
  }

  return (
    <div className="barcode-scanner">
      <div className="scanner-header">
        <h2>Scan Product Barcode</h2>
        <p>Position the barcode within the frame</p>
      </div>

      {error && (
        <div className="scanner-error">
          <p>{error}</p>
          <button onClick={handleCancel}>Go Back</button>
        </div>
      )}

      {isInitializing && !error && (
        <div className="scanner-loading">
          <p>Initializing camera...</p>
          {debugInfo && <p className="debug-info">{debugInfo}</p>}
          <div className="spinner"></div>
        </div>
      )}

      <div id="barcode-reader" ref={scannerRef}></div>

      <div className="scanner-actions">
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>

      <div className="scanner-tips">
        <h3>Tips for best results:</h3>
        <ul>
          <li>Hold your device steady</li>
          <li>Ensure good lighting</li>
          <li>Keep barcode flat and in focus</li>
        </ul>
      </div>

      {(showManualEntry || error) && (
        <div className="manual-entry">
          <h3>Manual Entry</h3>
          <p>Can't scan? Enter the barcode numbers manually:</p>
          <form onSubmit={handleManualSubmit}>
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode (e.g., 737628064502)"
              className="barcode-input"
            />
            <button type="submit" className="submit-button">
              Look Up Product
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default BarcodeScanner
