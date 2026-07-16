import React, { useState } from 'react';
import MemoryGrid from './MemoryGrid';
import CacheView from './CacheView';
import Controls from './Controls';

const MEMORY_SIZE = 64;
const CACHE_SIZE = 8;

function App() {
  const [mappingType, setMappingType] = useState('direct'); // 'direct' or 'associative'
  const [cache, setCache] = useState(
    Array(CACHE_SIZE).fill().map(() => ({ valid: false, tag: null, data: null, lastAccessed: 0 }))
  );
  const [stats, setStats] = useState({ hits: 0, misses: 0, accesses: 0 });
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);

  const handleMemoryAccess = (address) => {
    setStats((prev) => ({ ...prev, accesses: prev.accesses + 1 }));
    const currentAccessTime = stats.accesses + 1;

    let isHit = false;
    let targetCacheIndex = -1;
    let newCache = [...cache];

    if (mappingType === 'direct') {
      const index = address % CACHE_SIZE;
      const tag = Math.floor(address / CACHE_SIZE);
      
      if (cache[index].valid && cache[index].tag === tag) {
        isHit = true;
      } else {
        newCache[index] = { valid: true, tag, data: `Block ${address}`, lastAccessed: currentAccessTime };
      }
      targetCacheIndex = index;
    } else { // fully associative
      // Check for hit
      const hitIndex = cache.findIndex(line => line.valid && line.data === `Block ${address}`);
      if (hitIndex !== -1) {
        isHit = true;
        targetCacheIndex = hitIndex;
        newCache[hitIndex] = { ...newCache[hitIndex], lastAccessed: currentAccessTime };
      } else {
        // Miss: Find empty or LRU
        const emptyIndex = cache.findIndex(line => !line.valid);
        if (emptyIndex !== -1) {
          targetCacheIndex = emptyIndex;
        } else {
          // Find LRU
          let lruIndex = 0;
          let minTime = cache[0].lastAccessed;
          for (let i = 1; i < CACHE_SIZE; i++) {
            if (cache[i].lastAccessed < minTime) {
              minTime = cache[i].lastAccessed;
              lruIndex = i;
            }
          }
          targetCacheIndex = lruIndex;
        }
        newCache[targetCacheIndex] = { valid: true, tag: null, data: `Block ${address}`, lastAccessed: currentAccessTime };
      }
    }

    if (isHit) {
      setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
    } else {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      setCache(newCache);
    }
    
    // update access time for hits as well (done above for assoc, do it for direct too though not strictly necessary)
    if (isHit && mappingType === 'direct') {
       newCache[targetCacheIndex] = { ...newCache[targetCacheIndex], lastAccessed: currentAccessTime };
       setCache(newCache);
    }

    setLastUpdatedIndex(targetCacheIndex);
    setTimeout(() => setLastUpdatedIndex(null), 1000);
  };

  const handleReset = () => {
    setCache(Array(CACHE_SIZE).fill().map(() => ({ valid: false, tag: null, data: null, lastAccessed: 0 })));
    setStats({ hits: 0, misses: 0, accesses: 0 });
    setLastUpdatedIndex(null);
  };

  const handleMappingChange = (type) => {
    setMappingType(type);
    handleReset();
  };

  return (
    <div className="app-container">
      <div className="glass glass-panel">
        <h1>CPU Cache Simulator</h1>
        <Controls 
          mappingType={mappingType} 
          onMappingChange={handleMappingChange} 
          stats={stats} 
          onReset={handleReset} 
        />
      </div>

      <div className="grid-layout">
        <div className="glass glass-panel">
          <h2>Main Memory ({MEMORY_SIZE} blocks)</h2>
          <MemoryGrid 
            memorySize={MEMORY_SIZE} 
            onAccess={handleMemoryAccess} 
          />
        </div>

        <div className="glass glass-panel">
          <h2>Cache ({CACHE_SIZE} lines)</h2>
          <CacheView 
            cache={cache} 
            mappingType={mappingType} 
            lastUpdatedIndex={lastUpdatedIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
