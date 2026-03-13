'use client';

import { useState } from 'react';

export default function CityComparison({ getSavedCities, onCompare, icons }) {
  const [city1, setCity1] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [savedCityData, setSavedCityData] = useState(null);

  const handleCompare = async () => {
    if (!city1.trim()) return;

    const city1Data = await onCompare(city1);
    if (!city1Data) {
      setComparisonData(null);
      return;
    }

    // Get first saved city for comparison
    const savedCities = getSavedCities();
    let city2Data = null;

    if (savedCities.length > 0) {
      city2Data = await onCompare(savedCities[0]);
    }

    setComparisonData(city1Data);
    setSavedCityData(city2Data);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCompare();
    }
  };

  return (
    <div className="comparison-section">
      <h3 className="section-title">
        <i className="fas fa-balance-scale"></i>
        City Comparison
      </h3>
      <div className="comparison-inputs">
        <div className="comparison-input">
          <input
            type="text"
            id="city1"
            placeholder="First city..."
            value={city1}
            onChange={(e) => setCity1(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleCompare}>Compare</button>
        </div>
      </div>
      <div className="comparison-result">
        {comparisonData && (
          <div className="comparison-card">
            <div className="city">{comparisonData.name}</div>
            <div className="comp-icon">
              <i className={`fas ${icons[comparisonData.weather[0].icon] || 'fa-cloud'}`}></i>
            </div>
            <div className="comp-temp">{Math.round(comparisonData.main.temp)}°C</div>
            <div className="comp-condition">{comparisonData.weather[0].description}</div>
          </div>
        )}
        
        {savedCityData ? (
          <div className="comparison-card">
            <div className="city">{savedCityData.name}</div>
            <div className="comp-icon">
              <i className={`fas ${icons[savedCityData.weather[0].icon] || 'fa-cloud'}`}></i>
            </div>
            <div className="comp-temp">{Math.round(savedCityData.main.temp)}°C</div>
            <div className="comp-condition">{savedCityData.weather[0].description}</div>
          </div>
        ) : (
          <div className="comparison-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Save a city to compare
          </div>
        )}
      </div>
    </div>
  );
}

