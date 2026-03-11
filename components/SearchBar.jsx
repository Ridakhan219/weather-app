'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !loading) {
      onSearch(city);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-section">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          id="city"
          placeholder="Search city/Country..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
        />
      </div>
      <button 
        className="search-btn" 
        onClick={handleSubmit}
        disabled={loading}
      >
        <i className="fas fa-paper-plane"></i>
        Search
      </button>
    </div>
  );
}

