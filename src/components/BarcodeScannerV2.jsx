import { useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'
import './BarcodeScanner.css'

function BarcodeScannerV2({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [scanStatus, setScanStatus] = useState('Initializing...')
  const [manualBarcode, setManualBarcode] = useState('')
  const [lastDetected, setLastDetected] = useState('')
  const scannerRef = useRef(null)
  const detectedRef = useRef(false)
  const detectionCountRef = useRef({})

  useEffect(() => {
    detectedRef.current = false
    detectionCountRef.current = {}
    
    const startScanner = () => {
      setScanStatus('🎥 Starting camera...')
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 }
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 4,
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
          console.error('Quagga initialization error:', err)
          let errorMsg = 'Unable to start camera. '
          if (err.name === 'NotAllowedError') {
            errorMsg += 'Please allow camera access.'
          } else if (err.name === 'NotFoundError') {
            errorMsg += 'No camera found.'
          } else {
            errorMsg += 'Try manual entry below.'
          }
          setError(errorMsg)
          setScanStatus('')
          return
        }
        
        console.log('Quagga initialized successfully')
        setScanStatus('🎯 Camera ready - hold barcode steady!')
        Quagga.start()
      })

      Quagga.onDetected((result) => {
        if (detectedRef.current) return
        
        const code = result.codeResult.code
        const quality = result.codeResult.quality || 0
        
        // Only accept high quality reads
        if (quality < 75) {
          console.log(`Low quality read (${quality.toFixed(0)}): ${code}`)
          return
        }
        
        // Count detections
        if (!detectionCountRef.current[code]) {
          detectionCountRef.current[code] = 0
        }
        detectionCountRef.current[code]++
        
        setLastDetected(code)
        console.log(`Detected: ${code} (Quality: ${quality.toFixed(0)}, Count: ${detectionCountRef.current[code]})`)
        
        // Need 3 consistent high-quality reads before accepting
        if (detectionCountRef.current[code] >= 3) {
          console.log('✅ Barcode confirmed:', code)
          
          detectedRef.current = true
          setScanStatus(`✅ FOUND: ${code}`)
          
          Quagga.stop()
          
          setTimeout(() => {
            onScanSuccess(code)
          }, 800)
        } else {
          setScanStatus(`📍 Reading... (${detectionCountRef.current[code]}/3)`)
        }
      })
    }

    startScanner()

    return () => {
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
        <p>Hold barcode flat in camera view</p>
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
          maxWidth: '640px', 
          margin: '20px auto',
          backgroundColor: '#000',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '3px solid #4CAF50',
          minHeight: '480px'
        }}
      />

      {scanStatus && (
        <div style={{
          backgroundColor: scanStatus.includes('✅') ? '#4CAF50' : scanStatus.includes('📍') ? '#FF9800' : '#2196F3',
          color: 'white',
          padding: '20px',
          margin: '10px auto',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '640px'
        }}>
          {scanStatus}
        </div>
      )}

      {lastDetected && !scanStatus.includes('✅') && (
        <div style={{
          color: '#666',
          textAlign: 'center',
          fontSize: '16px',
          marginTop: '10px'
        }}>
          Last seen: {lastDetected}
        </div>
      )}

      <div style={{ 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '14px',
        margin: '10px 0'
      }}>
        💡 Hold phone steady • Ensure good lighting • Keep barcode in center
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
            placeholder="Enter barcode (e.g., 737628064502)"
            className="barcode-input"
            inputMode="numeric"
          />
          <button type="submit" className="submit-button">
            Look Up Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default BarcodeScannerV2
