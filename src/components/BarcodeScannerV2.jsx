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

        setScanStatus('🎯 Camera ready - scan barcode now!')
        
        // Use the back camera if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || videoDevices[0]

        setIsScanning(true)

        // Start decoding from video device
        await codeReader.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setScanStatus(`✅ FOUND: ${result.getText()}`)
              // Stop scanning
              codeReader.reset()
              setIsScanning(false)
              // Call success after a brief moment
              setTimeout(() => {
                onScanSuccess(result.getText())
              }, 500)
            }
            // Errors happen constantly while scanning - ignore them
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
          errorMsg += 'Use manual entry below.'
        }
        
        setError(errorMsg)
        setScanStatus('')
        setIsScanning(false)
      }
    }

    startScanner()

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
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
        <p>Point camera at barcode</p>
      </div>

      {error && (
        <div className="scanner-error">
          <p>{error}</p>
        </div>
      )}

      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        margin: '20px auto',
        backgroundColor: '#000',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block'
          }}
        />
      </div>

      {scanStatus && (
        <div style={{
          backgroundColor: scanStatus.includes('✅') ? '#4CAF50' : '#2196F3',
          color: 'white',
          padding: '15px',
          margin: '10px auto',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          {scanStatus}
        </div>
      )}

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
