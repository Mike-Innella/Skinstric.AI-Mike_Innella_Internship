import React, { useState } from 'react';
import ImageOptions from './Components/ImageOptions';
import './UI/Styles/Global.css';

const TestImageOptions = () => {
  const [showGrid, setShowGrid] = useState(false);
  
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Image Options Test</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={toggleGrid} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: showGrid ? '#333' : '#666', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>
      
      {showGrid && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(255,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          pointerEvents: 'none',
          zIndex: 1000
        }} />
      )}
      
      <ImageOptions 
        onImageSelected={(e) => console.log('Image selected:', e)}
        onCanProceed={(canProceed) => console.log('Can proceed:', canProceed)}
      />
    </div>
  );
};

export default TestImageOptions;
