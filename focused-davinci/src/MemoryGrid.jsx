import React, { useState } from 'react';

function MemoryGrid({ memorySize, onAccess }) {
  const [activeBlock, setActiveBlock] = useState(null);

  const handleClick = (index) => {
    setActiveBlock(index);
    onAccess(index);
    setTimeout(() => setActiveBlock(null), 300);
  };

  const blocks = Array.from({ length: memorySize }, (_, i) => i);

  return (
    <div className="memory-grid">
      {blocks.map((blockIndex) => (
        <div 
          key={blockIndex} 
          className={`memory-cell ${activeBlock === blockIndex ? 'active' : ''}`}
          onClick={() => handleClick(blockIndex)}
          title={`Block ${blockIndex}`}
        >
          {blockIndex}
        </div>
      ))}
    </div>
  );
}

export default MemoryGrid;
