import React, { useState, useRef } from 'react';
import { FiCamera, FiImage } from 'react-icons/fi';
import CaptureImage from '../Utils/CaptureImage';
import SimpleBackButton from './SimpleBackButton';
import '../UI/Styles/Components/ImageOptions.css';

/**
 * Component for selecting between camera and gallery image options
 * @param {Object} props - Component props
 * @param {Function} props.onImageSelected - Callback when image is selected
 * @param {Function} props.onCanProceed - Callback to update if user can proceed
 */
const ImageOptions = ({ onImageSelected, onCanProceed }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImageEvent, setCapturedImageEvent] = useState(null);
  const [cameraPermissionState, setCameraPermissionState] = useState('initial'); // 'initial', 'requesting', 'setting-up', 'ready'
  
  // Create a ref for the file input
  const fileInputRef = useRef(null);
  
  // Get camera utilities
  const {
    videoRef,
    requestCameraAccess,
    captureImage,
    stopCameraStream,
    hasStream
  } = CaptureImage({
    onImageCaptured: (base64Image) => {
      handleImageSelected(base64Image);
      setShowCamera(false);
      setCameraPermissionState('initial');
    },
    onError: (errorMsg) => {
      setError(errorMsg);
      setTimeout(() => setError(''), 3000);
      setCameraPermissionState('initial');
    }
  });
  
  // Handle file selection
  const handleFileChange = (event) => {
    setIsProcessing(true);
    const file = event.target.files[0];
    if (!file) {
      setIsProcessing(false);
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      setIsProcessing(false);
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        // Store the image preview
        setSelectedImage(reader.result);
        
        // Pass the event to the parent component
        onImageSelected?.(event);
        onCanProceed?.(true);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Error processing image');
        setTimeout(() => setError(''), 3000);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setError('Error reading file');
      setTimeout(() => setError(''), 3000);
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };
  
  // Handle image selection from camera
  const handleImageSelected = (base64Image) => {
    setIsProcessing(true);
    try {
      // Convert base64 to a Blob
      const byteCharacters = atob(base64Image);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
      const file = new File([blob], 'camera-image.jpg', { type: 'image/jpeg' });
      
      // Store the image preview
      setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
      
      // Create a synthetic event
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      
      // We'll submit the image when the user clicks the submit button
      // Store the synthetic event for later use
      setCapturedImageEvent(syntheticEvent);
      
      // Don't automatically set canProceed to true - wait for submit button click
      onCanProceed?.(false);
    } catch (error) {
      console.error('Error processing camera image:', error);
      setError('Error processing camera image');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle submit button click
  const handleSubmitImage = () => {
    if (capturedImageEvent) {
      // Call the onImageSelected callback with the synthetic event
      onImageSelected?.(capturedImageEvent);
      
      // Explicitly set canProceed to true
      onCanProceed?.(true);
    }
  };
  
  // Handle camera option click
  const handleCameraClick = async () => {
    setCameraPermissionState('requesting');
    setShowCamera(true);
  };
  
  // Handle camera permission response
  const handleCameraPermission = async (allow) => {
    if (allow) {
      setCameraPermissionState('setting-up');
      try {
        console.log('Requesting camera access after permission granted');
        await requestCameraAccess();
        console.log('Camera access successful, setting state to ready');
        setCameraPermissionState('ready');
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError(error.message || 'Error accessing camera');
        setTimeout(() => setError(''), 5000); // Show error for longer
        setShowCamera(false);
        setCameraPermissionState('initial');
      }
    } else {
      console.log('Camera permission denied by user');
      setShowCamera(false);
      setCameraPermissionState('initial');
    }
  };
  
  // Handle gallery option click
  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="image-options">
      {!selectedImage ? (
        <>
          {/* Camera Option */}
          <div className="image-options__option image-options__option--left" onClick={handleCameraClick}>
            <div className="image-options__diamond">
              <div className="image-options__icon-container">
                <FiCamera className="image-options__icon" />
                <div className="image-options__label-container image-options__label-container--left">
                  <div className="image-options__label">ALLOW A.I.</div>
                  <div className="image-options__label">TO SCAN YOUR FACE</div>
                  <div className="image-options__animated-line" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Gallery Option */}
          <div className="image-options__option image-options__option--right" onClick={handleGalleryClick}>
            <div className="image-options__diamond">
              <div className="image-options__icon-container">
                <FiImage className="image-options__icon" />
                <div className="image-options__label-container image-options__label-container--right">
                  <div className="image-options__label">ALLOW A.I.</div>
                  <div className="image-options__label">ACCESS GALLERY</div>
                  <div className="image-options__animated-line" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="image-options__preview">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="image-options__preview-image" 
          />
          <div className="image-options__preview-overlay">
            <div className="image-options__preview-text">
              {isProcessing ? 'Processing...' : 'Image Selected'}
            </div>
            {capturedImageEvent && !isProcessing && (
              <button 
                className="image-options__submit-button"
                onClick={handleSubmitImage}
              >
                SUBMIT
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {/* Camera view when active */}
      {showCamera && (
        <div className="image-options__camera-screen">
          <div className="image-options__camera-container">
            {cameraPermissionState === 'requesting' && (
              <div className="image-options__permission-dialog">
                <div className="image-options__permission-content">
                  <div className="image-options__permission-icon">
                    <FiCamera className="image-options__icon" />
                  </div>
                  <div className="image-options__permission-text">
                    ALLOW A.I. TO ACCESS YOUR CAMERA
                  </div>
                  <div className="image-options__permission-buttons">
                    <button 
                      className="image-options__permission-button image-options__permission-button--deny"
                      onClick={() => handleCameraPermission(false)}
                    >
                      DENY
                    </button>
                    <button 
                      className="image-options__permission-button image-options__permission-button--allow"
                      onClick={() => handleCameraPermission(true)}
                    >
                      ALLOW
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {cameraPermissionState === 'setting-up' && (
              <div className="image-options__setup-screen">
                <div className="image-options__setup-content">
                  <div className="image-options__setup-icon">
                    <FiCamera className="image-options__icon" />
                  </div>
                  <div className="image-options__setup-text">
                    SETTING UP CAMERA...
                  </div>
                </div>
              </div>
            )}
            
            {cameraPermissionState === 'ready' && (
              <>
                <div className="image-options__video-wrapper">
                  <video 
                    ref={videoRef}
                    className="image-options__video-element"
                    autoPlay
                    playsInline
                    muted
                    onError={(e) => {
                      console.error('Video element error:', e);
                      setError('Video error: ' + (e.target.error?.message || 'Unknown error'));
                      setTimeout(() => setError(''), 5000);
                    }}
                  />
                </div>
                
                <div className="image-options__camera-controls">
                  <div className="image-options__take-pic">
                    <div className="image-options__camera-button-container" onClick={captureImage}>
                      <div className="image-options__camera-button-inner"></div>
                      <div className="image-options__camera-button-outer"></div>
                    </div>
                    <div className="image-options__take-picture-text">TAKE PICTURE</div>
                  </div>
                </div>
                
                <div className="image-options__camera-instructions">
                  <p className="image-options__instructions-title">
                    TO GET BETTER RESULTS MAKE SURE TO HAVE
                  </p>
                  <div className="image-options__instructions-items">
                    <div className="image-options__instruction-item">
                      <div className="image-options__instruction-checkbox"></div>
                      <div className="image-options__instruction-text">NEUTRAL EXPRESSION</div>
                    </div>
                    <div className="image-options__instruction-item">
                      <div className="image-options__instruction-checkbox"></div>
                      <div className="image-options__instruction-text">FRONTAL POSE</div>
                    </div>
                    <div className="image-options__instruction-item">
                      <div className="image-options__instruction-checkbox"></div>
                      <div className="image-options__instruction-text">ADEQUATE LIGHTING</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="image-options__back-button-container">
              <SimpleBackButton
                customLabel="BACK"
                onButtonClick={() => {
                  stopCameraStream();
                  setShowCamera(false);
                  setCameraPermissionState('initial');
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && <div className="image-options__error">{error}</div>}
    </div>
  );
};

export default ImageOptions;
