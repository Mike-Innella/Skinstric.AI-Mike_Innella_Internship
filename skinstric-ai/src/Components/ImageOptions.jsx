import React, { useState, useRef } from 'react';
import CaptureImage from '../Utils/CaptureImage';
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
  // Create a ref for the file input
  const fileInputRef = useRef(null);
  
  // Get camera utilities
  const {
    videoRef,
    requestCameraAccess,
    captureImage,
    hasStream
  } = CaptureImage({
    onImageCaptured: (base64Image) => {
      handleImageSelected(base64Image);
      setShowCamera(false);
    },
    onError: (errorMsg) => {
      setError(errorMsg);
      setTimeout(() => setError(''), 3000);
    }
  });
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        onImageSelected?.(event);
        onCanProceed?.(true);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Error processing image');
        setTimeout(() => setError(''), 3000);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setError('Error reading file');
      setTimeout(() => setError(''), 3000);
    };

    reader.readAsDataURL(file);
  };
  
  // Handle image selection from camera
  const handleImageSelected = (base64Image) => {
    // Convert base64 to a Blob
    const byteCharacters = atob(base64Image);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
    const file = new File([blob], 'camera-image.jpg', { type: 'image/jpeg' });
    
    // Create a synthetic event
    const syntheticEvent = {
      target: {
        files: [file]
      }
    };
    
    onImageSelected?.(syntheticEvent);
    onCanProceed?.(true);
  };
  
  // Handle camera option click
  const handleCameraClick = async () => {
    setShowCamera(true);
    await requestCameraAccess();
  };
  
  // Handle gallery option click
  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="image-options">
      {/* Camera Option */}
      <div className="image-options__option" onClick={handleCameraClick}>
        <div className="image-options__diamond">
          <div className="image-options__icon-container">
            <div className="image-options__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z" fill="black"/>
                <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="black"/>
              </svg>
            </div>
            <div className="image-options__label">ALLOW A.I. TO SCAN YOUR FACE</div>
          </div>
        </div>
      </div>
      
      {/* Gallery Option */}
      <div className="image-options__option" onClick={handleGalleryClick}>
        <div className="image-options__diamond">
          <div className="image-options__icon-container">
            <div className="image-options__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="black"/>
                <path d="M14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z" fill="black"/>
              </svg>
            </div>
            <div className="image-options__label">ALLOW A.I. ACCESS GALLERY</div>
          </div>
        </div>
      </div>
      
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
        <div className="image-options__video">
          <video 
            ref={videoRef}
            className="image-options__video-element"
            autoPlay
            playsInline
          />
          
          {hasStream && (
            <button 
              className="image-options__capture-button"
              onClick={captureImage}
            >
              CAPTURE
            </button>
          )}
          
          <button 
            className="image-options__close-button"
            onClick={() => setShowCamera(false)}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Error message */}
      {error && <div className="image-options__error">{error}</div>}
    </div>
  );
};

export default ImageOptions;
