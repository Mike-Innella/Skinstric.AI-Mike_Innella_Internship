import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Utility component for handling camera capture
 * @param {Object} props - Component props
 * @param {Function} props.onImageCaptured - Callback when image is captured
 * @param {Function} props.onError - Callback when error occurs
 */
const CaptureImage = ({ onImageCaptured, onError }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  // Request camera access
  const requestCameraAccess = async () => {
    try {
      // Stop any existing stream first
      stopCameraStream();
      
      console.log('Requesting camera access...');
      
      // Check if we're on a mobile device
      const isMobile = window.innerWidth <= 768;
      
      // First try with constraints optimized for full-screen display
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: isMobile ? window.innerWidth * 2 : window.innerWidth }, // Higher resolution for mobile
          height: { ideal: isMobile ? window.innerHeight * 2 : window.innerHeight }, // Higher resolution for mobile
          aspectRatio: { ideal: window.innerWidth / window.innerHeight }
        },
        audio: false
      });
      
      console.log('Camera access granted with basic constraints');
      
      // Get video track and apply advanced constraints if possible
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        console.log('Video track obtained:', videoTrack.label);
        
        try {
          // Try to apply additional constraints if supported
          const capabilities = videoTrack.getCapabilities();
          console.log('Camera capabilities:', capabilities);
          
          // Only apply constraints that are supported by the device
          const advancedConstraints = {};
          
          if (capabilities.exposureMode && capabilities.exposureMode.includes('continuous')) {
            advancedConstraints.exposureMode = 'continuous';
          }
          
          if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
            advancedConstraints.focusMode = 'continuous';
          }
          
          if (capabilities.whiteBalanceMode && capabilities.whiteBalanceMode.includes('continuous')) {
            advancedConstraints.whiteBalanceMode = 'continuous';
          }
          
          if (Object.keys(advancedConstraints).length > 0) {
            await videoTrack.applyConstraints({
              advanced: [advancedConstraints]
            });
            console.log('Applied advanced camera constraints:', advancedConstraints);
          }
        } catch (constraintError) {
          // Some constraints might not be supported on all devices
          console.log('Some advanced camera constraints not supported', constraintError);
        }
      }
      
      setStream(mediaStream);
      
      // Add a small delay to ensure the video element is properly mounted in the DOM
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting video source object');
          videoRef.current.srcObject = mediaStream;
          
          // Ensure video is loaded properly
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, playing video');
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
              onError?.('Error playing video stream. Please try again.');
            });
          };
          
          // Add error handler for video element
          videoRef.current.onerror = (e) => {
            console.error('Video element error:', e);
            onError?.('Video element error. Please try again.');
          };
        } else {
          console.error('Video ref is null');
          onError?.('Video element not found. Please try again.');
        }
      }, 500); // 500ms delay to ensure DOM is ready
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      // Provide more specific error messages based on the error
      if (error.name === 'NotAllowedError') {
        onError?.('Camera access denied. Please grant camera permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        onError?.('No camera found. Please ensure your camera is connected and not in use by another application.');
      } else if (error.name === 'NotReadableError') {
        onError?.('Camera is in use by another application. Please close other applications using the camera.');
      } else {
        onError?.(`Unable to access camera: ${error.message || error.name || 'Unknown error'}`);
      }
    }
  };
  
  // Stop camera stream
  const stopCameraStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);
  
  // Handle window resize to adjust video constraints
  const handleResize = useCallback(() => {
    if (videoRef.current && stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          // Check if we're on a mobile device
          const isMobile = window.innerWidth <= 768;
          
          videoTrack.applyConstraints({
            width: { ideal: isMobile ? window.innerWidth * 2 : window.innerWidth }, // Higher resolution for mobile
            height: { ideal: isMobile ? window.innerHeight * 2 : window.innerHeight }, // Higher resolution for mobile
            aspectRatio: { ideal: window.innerWidth / window.innerHeight }
          }).catch(err => {
            console.log('Could not apply resize constraints:', err);
          });
        } catch (error) {
          console.log('Error applying resize constraints:', error);
        }
      }
    }
  }, [stream]);

  // Set up resize listener and clean up on unmount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopCameraStream();
    };
  }, [stopCameraStream, handleResize]);
  
  // Capture image from video stream
  const captureImage = () => {
    if (!videoRef.current || !stream) {
      onError?.('Camera not initialized');
      return;
    }
    
    try {
      console.log('Capturing image from video stream');
      
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Ensure we have valid dimensions
      if (!video.videoWidth || !video.videoHeight) {
        console.error('Video dimensions not available');
        onError?.('Unable to capture image. Please try again.');
        return;
      }
      
      console.log(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      
      // Apply background blur effect
      try {
        // First draw the video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Create a temporary canvas for face detection and blurring
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempContext = tempCanvas.getContext('2d');
        tempContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Apply a slight blur to the entire image first
        context.filter = 'blur(4px)';
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Then draw the center portion (assumed to be the face) without blur
        // This is a simple approximation - in a real app you'd use face detection
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const faceWidth = canvas.width * 0.5; // 50% of width
        const faceHeight = canvas.height * 0.6; // 60% of height
        
        // Reset the filter before drawing the face area
        context.filter = 'none';
        context.drawImage(
          tempCanvas, 
          centerX - faceWidth/2, centerY - faceHeight/2, faceWidth, faceHeight, // source rectangle
          centerX - faceWidth/2, centerY - faceHeight/2, faceWidth, faceHeight  // destination rectangle
        );
        
        console.log('Applied background blur effect');
      } catch (blurError) {
        console.error('Error applying blur effect:', blurError);
        // Fall back to normal capture if blur fails
        context.filter = 'none';
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      // Convert to base64 with high quality
      const base64Image = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
      console.log('Image captured and converted to base64');
      
      // Stop camera stream
      stopCameraStream();
      
      // Use setTimeout to ensure the UI updates before processing the image
      setTimeout(() => {
        onImageCaptured?.(base64Image);
      }, 100);
    } catch (error) {
      console.error('Error capturing image:', error);
      onError?.('Error capturing image');
    }
  };
  
  return {
    videoRef,
    requestCameraAccess,
    captureImage,
    stopCameraStream,
    hasStream: !!stream
  };
};

export default CaptureImage;
