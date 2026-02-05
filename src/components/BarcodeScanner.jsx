import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Quagga from '@ericblade/quagga2'
import { validateBarcode } from '../utils/barcodeValidator'
import './BarcodeScanner.css'

function BarcodeScanner({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Initializing...')
  const [manualBarcode, setManualBarcode] = useState('')
  const [validationError, setValidationError] = useState(null)
  const [scannerType, setScannerType] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanningRef = useRef(true)
  const detectedCodesRef = useRef({})
  const scannerRef = useRef(null)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    const initScanner = async () => {
      // Check if native Barcode Detection API is supported (Android Chrome/Edge)
      if ('BarcodeDetector' in window) {
        setScannerType('native')
        initNativeScanner()
      } else {
        // Fallback to Quagga2 for iOS/Safari
        setScannerType('quagga')
        initQuaggaScanner()
      }
    }

    const initNativeScanner = async () => {
      try {
        setStatus('🎥 Starting camera...')
        
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

        const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e']
        const supportedFormats = await window.BarcodeDetector.getSupportedFormats()
        const availableFormats = formats.filter(f => supportedFormats.includes(f))
        
        detectorRef.current = new window.BarcodeDetector({
          formats: availableFormats
        })

        setStatus('🎯 Point camera at barcode')
        scanningRef.current = true
        scanForBarcodes()

      } catch (err) {
        handleCameraError(err)
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
          
          if (!detectedCodesRef.current[code]) {
            detectedCodesRef.current[code] = 0
          }
          detectedCodesRef.current[code]++
          
          setStatus(`📍 Found: ${code} (${detectedCodesRef.current[code]}/2)`)
          
          if (detectedCodesRef.current[code] >= 2) {
            setStatus(`✅ CONFIRMED: ${code}`)
            scanningRef.current = false
            
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

      if (scanningRef.current) {
        requestAnimationFrame(scanForBarcodes)
      }
    }

    const initQuaggaScanner = () => {
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
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"],
          multiple: false
        },
        locate: true
      }, (err) => {
        if (err) {
          handleCameraError(err)
          return
        }
        
        setStatus('🎯 Point camera at barcode')
        Quagga.start()
      })

      Quagga.onDetected((result) => {
        const code = result.codeResult.code
        
        if (!detectedCodesRef.current[code]) {
          detectedCodesRef.current[code] = 0
        }
        detectedCodesRef.current[code]++
        
        setStatus(`📍 Found: ${code} (${detectedCodesRef.current[code]}/2)`)
        
        if (detectedCodesRef.current[code] >= 2) {
          setStatus(`✅ CONFIRMED: ${code}`)
          Quagga.stop()
          
          setTimeout(() => {
            onScanSuccess(code)
          }, 500)
        }
      })
    }

    const handleCameraError = (err) => {
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

    initScanner()

    return () => {
      scanningRef.current = false
      Quagga.stop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [onScanSuccess])

  const handleCancel = () => {
    scanningRef.current = false
    Quagga.stop()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onCancel()
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const barcode = manualBarcode.trim()
    
    if (!barcode) {
      setValidationError('Please enter a barcode')
      return
    }

    // Validate barcode format
    const validation = validateBarcode(barcode)
    if (!validation.isValid) {
      setValidationError(validation.message)
      return
    }

    setValidationError(null)
    scanningRef.current = false
    Quagga.stop()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onScanSuccess(barcode)
  }

  // Debounced validation for manual input
  const handleManualInput = (value) => {
    setManualBarcode(value)
    
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

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

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

      {scannerType === 'native' ? (
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
            muted
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      ) : (
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
      )}

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
        <button 
          onClick={handleCancel} 
          className="cancel-button"
          aria-label="Cancel scanning"
        >
          Cancel
        </button>
      </div>

      <div className="manual-entry">
        <h3>Or Enter Manually</h3>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="Enter barcode number"
            inputMode="numeric"
            aria-label="Manual barcode entry"
            aria-describedby="validation-error"
          />
          {validationError && (
            <div 
              id="validation-error" 
              className="validation-error"
              role="alert"
            >
              {validationError}
            </div>
          )}
          <button 
            type="submit"
            aria-label="Submit barcode"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

BarcodeScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default BarcodeScanner
