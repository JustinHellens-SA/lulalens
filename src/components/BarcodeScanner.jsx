import { useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Initializing...')
  const [manualBarcode, setManualBarcode] = useState('')
  const scannerRef = useRef(null)
  const detectedRef = useRef(false)
  const detectionCountRef = useRef({})

  useEffect(() => {
    detectedRef.current = false
    detectionCountRef.current = {}
    
    const startScanner = () => {
      // Ensure the scanner element is ready
      if (!scannerRef.current) {
        console.error('Scanner element not found')
        setError('Scanner element not ready. Please refresh.')
        setStatus('')
        return
      }

      setStatus('🎥 Starting camera...')
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "environment"
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader", 
            "upc_reader",
            "upc_e_reader"
          ],
          multiple: false
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error('Scanner initialization error:', err)
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
          })
          
          let errorMsg = 'Unable to start camera. '
          if (err.name === 'NotAllowedError') {
            errorMsg += 'Please allow camera access and refresh the page.'
          } else if (err.name === 'NotFoundError') {
            errorMsg += 'No camera found on this device.'
          } else if (err.name === 'NotReadableError' || err.name === 'OverconstrainedError') {
            errorMsg += 'Camera is in use by another app. Please close other apps using the camera.'
          } else {
            errorMsg += `Error: ${err.message || 'Unknown error'}. Try manual entry below.`
          }
          setError(errorMsg)
          setStatus('')
          return
        }
        
        console.log('Scanner initialized successfully')
        setStatus('🎯 Point camera at barcode')
        Quagga.start()
      })

      Quagga.onDetected((result) => {
        if (detectedRef.current) return
        
        const code = result.codeResult.code
        
        // Count detections for verification
        if (!detectionCountRef.current[code]) {
          detectionCountRef.current[code] = 0
        }
        detectionCountRef.current[code]++
        
        console.log(`Detected: ${code} (${detectionCountRef.current[code]}/2)`)
        setStatus(`📍 Reading... ${code}`)
        
        // Need 2 consistent reads
        if (detectionCountRef.current[code] >= 2) {
          console.log('✅ Barcode confirmed:', code)
          detectedRef.current = true
          setStatus(`✅ SCANNED: ${code}`)
          
          Quagga.stop()
          
          setTimeout(() => {
            onScanSuccess(code)
          }, 500)
        }
      })
    }

    // Wait for DOM to be ready before starting scanner
    const timer = setTimeout(() => {
      startScanner()
    }, 100)

    return () => {
      clearTimeout(timer)
      Quagga.stop()
      detectedRef.current = false
      detectionCountRef.current = {}
    }
  }, [onScanSuccess])

  const handleCancel = () => {
    Quagga.stop()
    onCancel()
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      Quagga.stop()
      onScanSuccess(manualBarcode.trim())
    }
  }

  return (
    <div className="barcode-scanner">
      <div className="scanner-header">
        <h2>📷 Scan Barcode</h2>
        <p>Hold barcode in camera view</p>
      </div>

      {error && (
        <div className="scanner-error">
          <p>{error}</p>
        </div>
      )}

      <div 
        ref={scannerRef}
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          margin: '20px auto',
          backgroundColor: '#000',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '3px solid #4CAF50',
          minHeight: '300px'
        }}
      />

      {status && (
        <div style={{
          backgroundColor: status.includes('✅') ? '#4CAF50' : status.includes('📍') ? '#FF9800' : '#2196F3',
          color: 'white',
          padding: '15px',
          margin: '10px auto',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          {status}
        </div>
      )}

      <div style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        margin: '15px 0'
      }}>
        💡 Keep barcode flat and well-lit
      </div>

      <div className="scanner-actions">
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>

      <div className="manual-entry">
        <h3>Or Enter Manually</h3>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Enter barcode number"
            inputMode="numeric"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default BarcodeScanner
