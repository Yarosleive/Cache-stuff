import React from 'react';

function CacheView({ cache, mappingType, lastUpdatedIndex }) {
  return (
    <table className="cache-table">
      <thead>
        <tr>
          <th>Line</th>
          <th>V</th>
          {mappingType === 'direct' && <th>Tag</th>}
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {cache.map((line, index) => (
          <tr 
            key={index} 
            className={`cache-row ${lastUpdatedIndex === index ? 'updated' : ''}`}
          >
            <td>{index}</td>
            <td>
              <span className={`valid-indicator ${line.valid ? 'valid' : ''}`} title={line.valid ? 'Valid' : 'Invalid'}></span>
            </td>
            {mappingType === 'direct' && (
              <td>{line.tag !== null ? line.tag : '-'}</td>
            )}
            <td>{line.data ? line.data : 'Empty'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CacheView;
