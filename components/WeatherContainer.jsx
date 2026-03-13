<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import Forecast from './Forecast';
import TemperatureChart from './TemperatureChart';
import CityComparison from './CityComparison';
import AIAdvice from './AIAdvice';
import AIChatPanel from './AIChatPanel';
import ThemeToggle from './ThemeToggle';
import SavedCities from './SavedCities';

// Weather icon mapping
const WEATHER_ICONS = {
  '01d': 'fa-sun',
  '01n': 'fa-moon',
  '02d': 'fa-cloud-sun',
  '02n': 'fa-cloud-moon',
  '03d': 'fa-cloud',
  '03n': 'fa-cloud',
  '04d': 'fa-clouds',
  '04n': 'fa-clouds',
  '09d': 'fa-cloud-rain',
  '09n': 'fa-cloud-rain',
  '10d': 'fa-cloud-sun-rain',
  '10n': 'fa-cloud-moon-rain',
  '11d': 'fa-bolt',
  '11n': 'fa-bolt',
  '13d': 'fa-snowflake',
  '13n': 'fa-snowflake',
  '50d': 'fa-smog',
  '50n': 'fa-smog'
};

// Weather background mapping
const WEATHER_BACKGROUNDS = {
  'clear': 'weather-sunny',
  'clouds': 'weather-cloudy',
  'rain': 'weather-rainy',
  'drizzle': 'weather-rainy',
  'thunderstorm': 'weather-stormy',
  'snow': 'weather-snowy',
  'mist': 'weather-cloudy',
  'fog': 'weather-cloudy',
  'haze': 'weather-cloudy',
  'dust': 'weather-stormy',
  'sand': 'weather-stormy',
  'ash': 'weather-stormy',
  'squall': 'weather-stormy',
  'tornado': 'weather-stormy'
};

// Danger thresholds
const DANGER_LEVELS = {
  tempHigh: 40,
  tempLow: -10,
  windSpeed: 25,
  humidityHigh: 95,
  aqiBad: 100
};

export default function WeatherContainer() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [weatherBackground, setWeatherBackground] = useState('');
  const [warning, setWarning] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('weather-app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('weather-app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Get saved cities
  const getSavedCities = () => {
    if (typeof window !== 'undefined') {
      const cities = localStorage.getItem('savedCities');
      return cities ? JSON.parse(cities) : [];
    }
    return [];
  };

  // Save city
  const saveCity = (city) => {
    const cities = getSavedCities();
    if (!cities.includes(city)) {
      const newCities = [...cities, city];
      localStorage.setItem('savedCities', JSON.stringify(newCities));
    }
  };

  // Remove city
  const removeCity = (city) => {
    const cities = getSavedCities();
    const newCities = cities.filter(c => c !== city);
    localStorage.setItem('savedCities', JSON.stringify(newCities));
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    if (!city || !city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherBackground('');

    try {
      // Fetch current weather
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!weatherRes.ok) {
        const errData = await weatherRes.json();
        throw new Error(errData.error || 'City not found');
      }
      const weather = await weatherRes.json();
      
      setWeatherData(weather);
      saveCity(city);
      
      // Generate AI advice
      generateAIAdvice(weather);
      
      // Update background
      updateWeatherBackground(weather);
      
      // Check warnings
      checkWeatherWarnings(weather);
      
      // Fetch forecast
      await fetchForecast(city);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast
  const fetchForecast = async (city) => {
    try {
      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
      if (!forecastRes.ok) {
        throw new Error('Forecast not available');
      }
      const forecast = await forecastRes.json();
      setForecastData(forecast);
    } catch (err) {
      console.error('Forecast error:', err);
      setForecastData(null);
    }
  };

  // Process forecast data
  const processForecastData = (forecastList) => {
    const dailyMap = new Map();
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dayKey)) {
        if (date.getHours() >= 11 && date.getHours() <= 14) {
          dailyMap.set(dayKey, item);
        }
      }
    });
    
    if (dailyMap.size < 5) {
      forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, item);
        }
      });
    }
    
    return Array.from(dailyMap.values()).slice(0, 5);
  };

  // Update weather background
  const updateWeatherBackground = (data) => {
    const weatherMain = data.weather[0].main.toLowerCase();
    let backgroundClass = 'weather-default';
    
    for (const [key, value] of Object.entries(WEATHER_BACKGROUNDS)) {
      if (weatherMain.includes(key)) {
        backgroundClass = value;
        break;
      }
    }
    
    // Check for extreme temperatures
    if (data.main.temp > 35) {
      backgroundClass = 'weather-hot';
    } else if (data.main.temp < 0) {
      backgroundClass = 'weather-cold';
    }
    
    setWeatherBackground(backgroundClass);
  };

  // Check weather warnings
  const checkWeatherWarnings = (data) => {
    const warnings = [];
    
    if (data.main.temp > DANGER_LEVELS.tempHigh) {
      warnings.push(`Extreme heat warning! Temperature above ${DANGER_LEVELS.tempHigh}°C`);
    } else if (data.main.temp < DANGER_LEVELS.tempLow) {
      warnings.push(`Extreme cold warning! Temperature below ${DANGER_LEVELS.tempLow}°C`);
    }
    
    if (data.wind.speed > DANGER_LEVELS.windSpeed) {
      warnings.push(`High wind warning! Wind speed above ${DANGER_LEVELS.windSpeed} m/s`);
    }
    
    if (data.main.humidity > DANGER_LEVELS.humidityHigh) {
      warnings.push(`Very high humidity (${data.main.humidity}%)`);
    }
    
    if (data.weather[0].main.toLowerCase().includes('thunderstorm')) {
      warnings.push('Thunderstorm warning! Seek shelter immediately.');
    } else if (data.weather[0].main.toLowerCase().includes('tornado')) {
      warnings.push('Tornado warning! Take immediate shelter!');
    }
    
    if (warnings.length > 0) {
      const isSevere = warnings.some(w => w.includes('Extreme') || w.includes('Tornado') || w.includes('Thunderstorm'));
      setWarning({ message: warnings.join(' | '), isSevere });
    } else {
      setWarning(null);
    }
  };

  // Generate AI advice
  const generateAIAdvice = (data) => {
    return data;
  };

  const handleCloseWarning = () => {
    setWarning(null);
  };

  const handleCompareCities = async (city1, city2) => {
    if (!city1) return null;
    
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city1)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Theme Toggle */}
      <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      {/* Warning Banner */}
      {warning && (
        <div className={`warning-banner active ${warning.isSevere ? 'danger' : ''}`}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{warning.message}</span>
          <button className="warning-close" onClick={handleCloseWarning}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Main Container */}
      <main className="weather-container">
        {/* Header */}
        <header className="weather-header">
          <div className="logo">
            <div className="lottie-container" id="weatherLottie"></div>
            <h1>Weather Web</h1>
          </div>
          <p className="tagline">Advanced AI-powered forecasting</p>
        </header>
        
        {/* Saved Cities */}
        <SavedCities 
          getSavedCities={getSavedCities} 
          removeCity={removeCity} 
          onSearch={fetchWeather}
        />
        
        {/* Search Bar */}
        <SearchBar onSearch={fetchWeather} loading={loading} />
        
        {/* Loading */}
        <div className={`loader ${loading ? 'active' : ''}`}>
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="weather-result">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Unable to fetch weather</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Weather Display */}
        {weatherData && !loading && (
          <>
            <WeatherDisplay weather={weatherData} icons={WEATHER_ICONS} />
            
            <AIAdvice weather={weatherData} />
            
            {forecastData && (
              <>
                <Forecast forecast={forecastData} icons={WEATHER_ICONS} processData={processForecastData} />
                <TemperatureChart forecast={forecastData} processData={processForecastData} theme={theme} />
              </>
            )}
          </>
        )}
        
        {/* Default Welcome State */}
        {!weatherData && !loading && !error && (
          <div className="weather-result">
            <div className="welcome-state">
              <lottie-player 
                id="welcomeLottie" 
                src="https://assets2.lottiefiles.com/packages/lf20squ9ky.json" 
                style={{ width: '150px', height: '150px' }} 
                loop 
                autoplay
              ></lottie-player>
              <h2>Welcome!</h2>
              <p>Search for a city to get started</p>
            </div>
          </div>
        )}
        
        {/* City Comparison */}
        <CityComparison 
          getSavedCities={getSavedCities} 
          onCompare={handleCompareCities}
          icons={WEATHER_ICONS}
        />
        
        {/* Footer */}
        <footer className="app-footer">
          <p>Made by <i className="fas fa-heart"></i> Rida Khan</p>
        </footer>
      </main>
      
      {/* Chat Bubble */}
      <button className="chat-bubble" onClick={() => setShowChat(!showChat)}>
        <i className="fas fa-comments"></i>
      </button>
      
      {/* Chat Panel */}
      <AIChatPanel 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        weatherData={weatherData}
      />
    </>
  );
}

=======
'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import Forecast from './Forecast';
import TemperatureChart from './TemperatureChart';
import CityComparison from './CityComparison';
import AIAdvice from './AIAdvice';
import AIChatPanel from './AIChatPanel';
import ThemeToggle from './ThemeToggle';
import SavedCities from './SavedCities';

// Weather icon mapping
const WEATHER_ICONS = {
  '01d': 'fa-sun',
  '01n': 'fa-moon',
  '02d': 'fa-cloud-sun',
  '02n': 'fa-cloud-moon',
  '03d': 'fa-cloud',
  '03n': 'fa-cloud',
  '04d': 'fa-clouds',
  '04n': 'fa-clouds',
  '09d': 'fa-cloud-rain',
  '09n': 'fa-cloud-rain',
  '10d': 'fa-cloud-sun-rain',
  '10n': 'fa-cloud-moon-rain',
  '11d': 'fa-bolt',
  '11n': 'fa-bolt',
  '13d': 'fa-snowflake',
  '13n': 'fa-snowflake',
  '50d': 'fa-smog',
  '50n': 'fa-smog'
};

// Weather background mapping
const WEATHER_BACKGROUNDS = {
  'clear': 'weather-sunny',
  'clouds': 'weather-cloudy',
  'rain': 'weather-rainy',
  'drizzle': 'weather-rainy',
  'thunderstorm': 'weather-stormy',
  'snow': 'weather-snowy',
  'mist': 'weather-cloudy',
  'fog': 'weather-cloudy',
  'haze': 'weather-cloudy',
  'dust': 'weather-stormy',
  'sand': 'weather-stormy',
  'ash': 'weather-stormy',
  'squall': 'weather-stormy',
  'tornado': 'weather-stormy'
};

// Danger thresholds
const DANGER_LEVELS = {
  tempHigh: 40,
  tempLow: -10,
  windSpeed: 25,
  humidityHigh: 95,
  aqiBad: 100
};

export default function WeatherContainer() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [weatherBackground, setWeatherBackground] = useState('');
  const [warning, setWarning] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('weather-app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('weather-app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Get saved cities
  const getSavedCities = () => {
    if (typeof window !== 'undefined') {
      const cities = localStorage.getItem('savedCities');
      return cities ? JSON.parse(cities) : [];
    }
    return [];
  };

  // Save city
  const saveCity = (city) => {
    const cities = getSavedCities();
    if (!cities.includes(city)) {
      const newCities = [...cities, city];
      localStorage.setItem('savedCities', JSON.stringify(newCities));
    }
  };

  // Remove city
  const removeCity = (city) => {
    const cities = getSavedCities();
    const newCities = cities.filter(c => c !== city);
    localStorage.setItem('savedCities', JSON.stringify(newCities));
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    if (!city || !city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherBackground('');

    try {
      // Fetch current weather
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!weatherRes.ok) {
        const errData = await weatherRes.json();
        throw new Error(errData.error || 'City not found');
      }
      const weather = await weatherRes.json();
      
      setWeatherData(weather);
      saveCity(city);
      
      // Generate AI advice
      generateAIAdvice(weather);
      
      // Update background
      updateWeatherBackground(weather);
      
      // Check warnings
      checkWeatherWarnings(weather);
      
      // Fetch forecast
      await fetchForecast(city);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast
  const fetchForecast = async (city) => {
    try {
      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
      if (!forecastRes.ok) {
        throw new Error('Forecast not available');
      }
      const forecast = await forecastRes.json();
      setForecastData(forecast);
    } catch (err) {
      console.error('Forecast error:', err);
      setForecastData(null);
    }
  };

  // Process forecast data
  const processForecastData = (forecastList) => {
    const dailyMap = new Map();
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dayKey)) {
        if (date.getHours() >= 11 && date.getHours() <= 14) {
          dailyMap.set(dayKey, item);
        }
      }
    });
    
    if (dailyMap.size < 5) {
      forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, item);
        }
      });
    }
    
    return Array.from(dailyMap.values()).slice(0, 5);
  };

  // Update weather background
  const updateWeatherBackground = (data) => {
    const weatherMain = data.weather[0].main.toLowerCase();
    let backgroundClass = 'weather-default';
    
    for (const [key, value] of Object.entries(WEATHER_BACKGROUNDS)) {
      if (weatherMain.includes(key)) {
        backgroundClass = value;
        break;
      }
    }
    
    // Check for extreme temperatures
    if (data.main.temp > 35) {
      backgroundClass = 'weather-hot';
    } else if (data.main.temp < 0) {
      backgroundClass = 'weather-cold';
    }
    
    setWeatherBackground(backgroundClass);
  };

  // Check weather warnings
  const checkWeatherWarnings = (data) => {
    const warnings = [];
    
    if (data.main.temp > DANGER_LEVELS.tempHigh) {
      warnings.push(`Extreme heat warning! Temperature above ${DANGER_LEVELS.tempHigh}°C`);
    } else if (data.main.temp < DANGER_LEVELS.tempLow) {
      warnings.push(`Extreme cold warning! Temperature below ${DANGER_LEVELS.tempLow}°C`);
    }
    
    if (data.wind.speed > DANGER_LEVELS.windSpeed) {
      warnings.push(`High wind warning! Wind speed above ${DANGER_LEVELS.windSpeed} m/s`);
    }
    
    if (data.main.humidity > DANGER_LEVELS.humidityHigh) {
      warnings.push(`Very high humidity (${data.main.humidity}%)`);
    }
    
    if (data.weather[0].main.toLowerCase().includes('thunderstorm')) {
      warnings.push('Thunderstorm warning! Seek shelter immediately.');
    } else if (data.weather[0].main.toLowerCase().includes('tornado')) {
      warnings.push('Tornado warning! Take immediate shelter!');
    }
    
    if (warnings.length > 0) {
      const isSevere = warnings.some(w => w.includes('Extreme') || w.includes('Tornado') || w.includes('Thunderstorm'));
      setWarning({ message: warnings.join(' | '), isSevere });
    } else {
      setWarning(null);
    }
  };

  // Generate AI advice
  const generateAIAdvice = (data) => {
    return data;
  };

  const handleCloseWarning = () => {
    setWarning(null);
  };

  const handleCompareCities = async (city1, city2) => {
    if (!city1) return null;
    
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city1)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Theme Toggle */}
      <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      {/* Warning Banner */}
      {warning && (
        <div className={`warning-banner active ${warning.isSevere ? 'danger' : ''}`}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{warning.message}</span>
          <button className="warning-close" onClick={handleCloseWarning}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Main Container */}
      <main className="weather-container">
        {/* Header */}
        <header className="weather-header">
          <div className="logo">
            <div className="lottie-container" id="weatherLottie"></div>
            <h1>Weather Web</h1>
          </div>
          <p className="tagline">Advanced AI-powered forecasting</p>
        </header>
        
        {/* Saved Cities */}
        <SavedCities 
          getSavedCities={getSavedCities} 
          removeCity={removeCity} 
          onSearch={fetchWeather}
        />
        
        {/* Search Bar */}
        <SearchBar onSearch={fetchWeather} loading={loading} />
        
        {/* Loading */}
        <div className={`loader ${loading ? 'active' : ''}`}>
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="weather-result">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Unable to fetch weather</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Weather Display */}
        {weatherData && !loading && (
          <>
            <WeatherDisplay weather={weatherData} icons={WEATHER_ICONS} />
            
            <AIAdvice weather={weatherData} />
            
            {forecastData && (
              <>
                <Forecast forecast={forecastData} icons={WEATHER_ICONS} processData={processForecastData} />
                <TemperatureChart forecast={forecastData} processData={processForecastData} theme={theme} />
              </>
            )}
          </>
        )}
        
        {/* Default Welcome State */}
        {!weatherData && !loading && !error && (
          <div className="weather-result">
            <div className="welcome-state">
              <lottie-player 
                id="welcomeLottie" 
                src="https://assets2.lottiefiles.com/packages/lf20squ9ky.json" 
                style={{ width: '150px', height: '150px' }} 
                loop 
                autoplay
              ></lottie-player>
              <h2>Welcome!</h2>
              <p>Search for a city to get started</p>
            </div>
          </div>
        )}
        
        {/* City Comparison */}
        <CityComparison 
          getSavedCities={getSavedCities} 
          onCompare={handleCompareCities}
          icons={WEATHER_ICONS}
        />
        
        {/* Footer */}
        <footer className="app-footer">
          <p>Made by <i className="fas fa-heart"></i> Rida Khan</p>
        </footer>
      </main>
      
      {/* Chat Bubble */}
      <button className="chat-bubble" onClick={() => setShowChat(!showChat)}>
        <i className="fas fa-comments"></i>
      </button>
      
      {/* Chat Panel */}
      <AIChatPanel 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        weatherData={weatherData}
      />
    </>
  );
}

>>>>>>> 43126c96babf3afbbcccf11101a80700601a7caa
