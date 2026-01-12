import { useEffect, useRef, useState } from 'react'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Initializing...')
  const [isSupported, setIsSupported] = useState(true)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanningRef = useRef(true)
  const detectedCodesRef = useRef({})
  const [scanStatus, setScanStatus] = useState('') // Visible scan status
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const isStartingRef = useRef(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const initScanner = async () => {
      // Check if Barcode Detection API is supported
      if (!('BarcodeDetector' in window)) {
        setIsSupported(false)
        setError('Barcode scanner not supported on this browser. Please use Chrome or Edge.')
        setStatus('')
        return
      }

      try {
        setStatus('🎥 Starting camera...')
        
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
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

        setStatus('🎯 Camera ready - point at barcode!')
        
        // Start scanning loop
        scanningRef.current = true
        scanForBarcodes()

      } catch (err) {
        console.error('Scanner initialization error:', err)
        let errorMsg = 'Unable to start camera. '
        if (err.name === 'NotAllowedError') {
          errorMsg += 'Please allow camera access.'
        } else if (err.name === 'NotFoundError') {
          errorMsg += 'No camera found.'
        } else {
          errorMsg += err.message
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
  }, [onScanSuccess])

  const handleCancel = () => {
    scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onCancel()
  }

  return (
    <div className="barcode-scanner">
      <div className="scanner-header">
        <h2>📷 Scan Barcode</h2>
        <p>Hold phone steady over barcode</p>
      </div>

      {error && (
        <div className="scanner-error">
          <p>{error}</p>
          {!isSupported && (
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              💡 This feature requires Chrome or Edge browser
            </p>
          )}
        </div>
      )}

      <div style={{
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
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>

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
        margin: '10px 0'
      }}>
        💡 Keep barcode centered and in focus
      </div>

      <div className="scanner-actions">
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default BarcodeScanner
