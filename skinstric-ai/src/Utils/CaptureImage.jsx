import { useRef, useState, useEffect } from 'react';

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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onError?.('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };
  
  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  // Capture image from video stream
  const captureImage = () => {
    if (!videoRef.current || !stream) {
      onError?.('Camera not initialized');
      return;
    }
    
    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      onImageCaptured?.(base64Image);
      
      // Stop camera stream
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    } catch (error) {
      console.error('Error capturing image:', error);
      onError?.('Error capturing image');
    }
  };
  
  return {
    videoRef,
    requestCameraAccess,
    captureImage,
    hasStream: !!stream
  };
};

export default CaptureImage;
