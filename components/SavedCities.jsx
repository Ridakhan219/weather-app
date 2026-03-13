'use client';

import { useState, useEffect } from 'react';

export default function SavedCities({ getSavedCities, removeCity, onSearch }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(getSavedCities());
  }, [getSavedCities]);

  const handleAddCity = () => {
    const city = prompt('Enter city name to save:');
    if (city && city.trim()) {
      // Save to localStorage
      const currentCities = getSavedCities();
      if (!currentCities.includes(city.trim())) {
        const newCities = [...currentCities, city.trim()];
        localStorage.setItem('savedCities', JSON.stringify(newCities));
        setCities(newCities);
      }
    }
  };

  const handleRemoveCity = (e, city) => {
    e.stopPropagation();
    const newCities = cities.filter(c => c !== city);
    localStorage.setItem('savedCities', JSON.stringify(newCities));
    setCities(newCities);
    removeCity(city);
  };

  const handleSearchCity = (city) => {
    onSearch(city);
  };

  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="saved-cities">
      <div className="saved-cities-header">
        <i className="fas fa-bookmark"></i>
        <span>Saved Cities</span>
      </div>
      <div className="saved-cities-list">
        {cities.map((city, index) => (
          <div 
            className="saved-city-chip" 
            key={index}
            onClick={() => handleSearchCity(city)}
          >
            {city}
            <span className="remove" onClick={(e) => handleRemoveCity(e, city)}>
              <i className="fas fa-times"></i>
            </span>
          </div>
        ))}
        <button className="add-city-btn" onClick={handleAddCity}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
}

