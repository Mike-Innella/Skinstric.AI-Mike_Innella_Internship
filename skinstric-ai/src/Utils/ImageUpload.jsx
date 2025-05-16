import React, { forwardRef, useRef } from 'react';

/**
 * Utility component for handling image uploads from device
 * @param {Object} props - Component props
 * @param {Function} props.onImageSelected - Callback when image is selected
 * @param {Function} props.onError - Callback when error occurs
 * @param {Ref} ref - Forwarded ref
 */
const ImageUpload = forwardRef(({ onImageSelected, onError }, ref) => {
  // Create a ref for the file input
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      onError?.('Please select an image file');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        // Pass both the base64 data and the file object
        const base64String = reader.result.split(',')[1];
        onImageSelected?.(base64String, file);
      } catch (error) {
        console.error('Error processing image:', error);
        onError?.('Error processing image');
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      onError?.('Error reading file');
    };

    reader.readAsDataURL(file);
  };
  
  // Expose the ref to allow parent components to trigger file input
  React.useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  }));

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
});

export default ImageUpload;
