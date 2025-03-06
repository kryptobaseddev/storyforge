import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '50px', 
      margin: '50px', 
      backgroundColor: 'red', 
      color: 'white',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <h1 style={{ fontSize: '32px' }}>TEST PAGE</h1>
      <p style={{ fontSize: '24px' }}>If you can see this, components can render in this area.</p>
    </div>
  );
};

export default TestPage; 