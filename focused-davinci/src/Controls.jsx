import React from 'react';

function Controls({ mappingType, onMappingChange, stats, onReset }) {
  const hitRate = stats.accesses > 0 
    ? ((stats.hits / stats.accesses) * 100).toFixed(1) 
    : 0;

  return (
    <div className="controls-container">
      <div>
        <button 
          className="btn" 
          onClick={() => onMappingChange(mappingType === 'direct' ? 'associative' : 'direct')}
        >
          Mode: {mappingType === 'direct' ? 'Direct Mapped' : 'Fully Associative'}
        </button>
        <button className="btn" onClick={onReset} style={{ marginLeft: '10px', background: '#475569', color: 'white' }}>
          Reset Cache
        </button>
      </div>

      <div className="stats-card">
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#10b981' }}>{stats.hits}</span>
          <span className="stat-label">Hits</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#ef4444' }}>{stats.misses}</span>
          <span className="stat-label">Misses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{hitRate}%</span>
          <span className="stat-label">Hit Rate</span>
        </div>
      </div>
    </div>
  );
}

export default Controls;
