import { useEffect, useRef, useState } from 'react'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Initializing...')
  const [manualBarcode, setManualBarcode] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanningRef = useRef(true)
  const detectedCodesRef = useRef({})

  useEffect(() => {
    const initScanner = async () => {
      // Check if Barcode Detection API is supported
      if (!('BarcodeDetector' in window)) {
        setError('Barcode scanner requires Chrome or Edge browser. Please switch browsers or use manual entry.')
        setStatus('')
        return
      }

      try {
        setStatus('🎥 Starting camera...')
        
        // Get camera stream with rear camera preference
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Create barcode detector with retail formats
        const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e']
        const supportedFormats = await window.BarcodeDetector.getSupportedFormats()
        const availableFormats = formats.filter(f => supportedFormats.includes(f))
        
        detectorRef.current = new window.BarcodeDetector({
          formats: availableFormats
        })

        setStatus('🎯 Point camera at barcode')
        
        // Start scanning loop
        scanningRef.current = true
        scanForBarcodes()

      } catch (err) {
        console.error('Scanner initialization error:', err)
        let errorMsg = 'Unable to start camera. '
        if (err.name === 'NotAllowedError') {
          errorMsg += 'Please allow camera access and refresh the page.'
        } else if (err.name === 'NotFoundError') {
          errorMsg += 'No camera found on this device.'
        } else if (err.name === 'NotReadableError') {
          errorMsg += 'Camera is in use by another app.'
        } else {
          errorMsg += err.message || 'Try manual entry below.'
        }
        setError(errorMsg)
        setStatus('')
      }
    }

    const scanForBarcodes = async () => {
      if (!scanningRef.current || !videoRef.current || !detectorRef.current) {
        return
      }

      try {
        const barcodes = await detectorRef.current.detect(videoRef.current)
        
        if (barcodes.length > 0) {
          const barcode = barcodes[0]
          const code = barcode.rawValue
          
          // Count detections for verification
          if (!detectedCodesRef.current[code]) {
            detectedCodesRef.current[code] = 0
          }
          detectedCodesRef.current[code]++
          
          console.log(`Detected: ${code} (${detectedCodesRef.current[code]}/2)`)
          setStatus(`📍 Found: ${code} (${detectedCodesRef.current[code]}/2)`)
          
          // Need 2 consistent reads
          if (detectedCodesRef.current[code] >= 2) {
            console.log('✅ Barcode confirmed:', code)
            setStatus(`✅ CONFIRMED: ${code}`)
            scanningRef.current = false
            
            // Stop camera
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop())
            }
            
            setTimeout(() => {
              onScanSuccess(code)
            }, 500)
            return
          }
        }
      } catch (err) {
        console.error('Detection error:', err)
      }

      // Continue scanning
      if (scanningRef.current) {
        requestAnimationFrame(scanForBarcodes)
      }
    }

    initScanner()

    return () => {
      scanningRef.current = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  },scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onCancel()
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      scanningRef.current = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }lSubmit = (e) => {
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

      {errostyle={{
        width: '100%',
        maxWidth: '500px',
        margin: '20px auto',
        backgroundColor: '#000',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '3px solid #4CAF50'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div   backgroundColor: '#000',
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
