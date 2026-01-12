import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import './BarcodeScanner.css'

function BarcodeScannerV2({ onScanSuccess, onCancel }) {
  const [error, setError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('Initializing...')
  const [manualBarcode, setManualBarcode] = useState('')
  const videoRef = useRef(null)
  const codeReaderRef = useRef(null)

  useEffect(() => {
    const startScanner = async () => {
      try {
        setScanStatus('🎥 Starting camera...')
        const codeReader = new BrowserMultiFormatReader()
        codeReaderRef.current = codeReader

        // Get video devices
        const videoDevices = await codeReader.listVideoInputDevices()
        
        if (videoDevices.length === 0) {
          setError('No camera found on this device.')
          return
        }

        setScanStatus('🎯 Camera ready - hold barcode steady in view')
        
        // Use the back camera if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || videoDevices[0]

        setIsScanning(true)

        // Start decoding from video device
        codeReader.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const barcode = result.getText()
              console.log('✅ Barcode detected:', barcode)
              setScanStatus(`✅ FOUND: ${barcode}`)
              
              // Stop scanning immediately
              if (codeReaderRef.current) {
                codeReaderRef.current.reset()
              }
              setIsScanning(false)
              
              // Call success after brief delay to show the found message
              setTimeout(() => {
                onScanSuccess(barcode)
              }, 800)
            }
            if (err && err.name !== 'NotFoundException') {
              console.error('Scan error:', err)
            }
          }
        )
      } catch (err) {
        console.error('Scanner error:', err)
        let errorMsg = 'Unable to access camera. '
        
        if (err.name === 'NotAllowedError') {
          errorMsg += 'Please allow camera access and try again.'
        } else if (err.name === 'NotFoundError') {
          errorMsg += 'No camera found.'
        } else {
          errorMsg += err.message || 'Use manual entry below.'
        }
        
        setError(errorMsg)
        setScanStatus('')
        setIsScanning(false)
      }
    }

    startScanner()

    return () => {
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.reset()
        } catch (e) {
          console.log('Error cleaning up scanner:', e)
        }
      }
    }
  }, [onScanSuccess])

  const handleCancel = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
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
        <h2>📷 Scan Barcode</h2>
        <p>Hold barcode flat in camera view</p>
      </div>

      {error && (
        <div className="scanner-error">
          <p>{error}</p>
        </div>
      )}

      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        margin: '20px auto',
        backgroundColor: '#000',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '3px solid #4CAF50'
      }}>
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block',
            minHeight: '300px'
          }}
          autoPlay
          playsInline
        />
      </div>

      {scanStatus && (
        <div style={{
          backgroundColor: scanStatus.includes('✅') ? '#4CAF50' : '#2196F3',
          color: 'white',
          padding: '20px',
          margin: '10px auto',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          {scanStatus}
        </div>
      )}

      <div style={{ 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '14px',
        margin: '10px 0'
      }}>
        💡 Tip: Tap screen to focus if barcode is blurry
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
