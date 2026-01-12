import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const [scanStatus, setScanStatus] = useState('') // Visible scan status
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
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39
          ],
          aspectRatio: 1.0
        }

        console.log('Starting html5-qrcode with config:', config)
        
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            setScanStatus(`✅ FOUND: ${decodedText}`)
            console.log('✅ Barcode detected:', decodedText)
            // Stop scanner immediately and pass the result
            if (html5QrCodeRef.current) {
              console.log('Stopping scanner...')
              html5QrCodeRef.current.stop()
                .then(() => {
                  console.log('Scanner stopped, calling onScanSuccess')
                  setScanStatus('Processing...')
                  setTimeout(() => onScanSuccess(decodedText), 100)
                })
                .catch(err => {
                  console.error('Error stopping scanner:', err)
                  // Call success anyway
                  setScanStatus('Processing...')
                  setTimeout(() => onScanSuccess(decodedText), 100)
                })
            } else {
              setScanStatus('Processing...')
              setTimeout(() => onScanSuccess(decodedText), 100)
            }
          },
          (errorMessage) => {
            // Scanning errors (can be ignored - these happen constantly while scanning)
          }
        )
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        console.log('Scanner started successfully')
        setDebugInfo('🎯 Camera ready - scan any barcode now!')
        setScanStatus('🎯 Point camera at barcode...')
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

      {scanStatus && (
        <div style={{
          backgroundColor: scanStatus.includes('✅') ? '#4CAF50' : '#2196F3',
          color: 'white',
          padding: '15px',
          margin: '10px 0',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {scanStatus}
        </div>
      )}

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
