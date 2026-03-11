'use client';

import { useEffect } from 'react';

const LOTTIE_ANIMATIONS = {
  clear: 'https://assets2.lottiefiles.com/packages/lf20squ9ky.json',
  clouds: 'https://assets9.lottiefiles.com/packages/lf20tX3uZ.json',
  rain: 'https://assets1.lottiefiles.com/packages/lf20jaedp.json',
  drizzle: 'https://assets1.lottiefiles.com/packages/lf20jaedp.json',
  thunderstorm: 'https://assets6.lottiefiles.com/packages/lf20tnooa8p.json',
  snow: 'https://assets3.lottiefiles.com/packages/lf20d7lq8.json',
  mist: 'https://assets9.lottiefiles.com/packages/lf20tX3uZ.json',
  default: 'https://assets2.lottiefiles.com/packages/lf20squ9ky.json'
};

export default function WeatherDisplay({ weather, icons }) {
  const iconCode = weather.weather[0].icon;
  const iconClass = icons[iconCode] || 'fa-cloud';
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);

  useEffect(() => {
    // Update Lottie animation
    const container = document.getElementById('weatherLottie');
    if (container) {
      const weatherMain = weather.weather[0].main.toLowerCase();
      let lottieUrl = LOTTIE_ANIMATIONS.default;
      
      for (const [key, url] of Object.entries(LOTTIE_ANIMATIONS)) {
        if (weatherMain.includes(key)) {
          lottieUrl = url;
          break;
        }
      }
      
      container.innerHTML = '';
      
      const player = document.createElement('lottie-player');
      player.setAttribute('src', lottieUrl);
      player.setAttribute('style', 'width: 45px; height: 45px;');
      player.setAttribute('loop', '');
      player.setAttribute('autoplay', '');
      container.appendChild(player);
    }
  }, [weather]);

  return (
    <div className="weather-result">
      <div className="weather-data">
        <div className="city-name">
          <h2>
            <i className="fas fa-map-marker-alt"></i>
            {weather.name}
          </h2>
          <span className="country">{weather.sys.country}</span>
        </div>
        
        <div className="weather-main">
          <div className="weather-icon-large">
            <i className={`fas ${iconClass}`}></i>
          </div>
          <div className="temperature">
            <div className="temp">{temp}</div>
            <div className="unit">°C</div>
            <div className="feels-like">Feels like {feelsLike}°</div>
          </div>
        </div>
        
        <div className="weather-condition">
          <h3>{weather.weather[0].main}</h3>
          <p className="description">{weather.weather[0].description}</p>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <i className="fas fa-temperature-low"></i>
            <div className="label">Temp Min</div>
            <div className="value">{Math.round(weather.main.temp_min)}°C</div>
          </div>
          <div className="detail-item">
            <i className="fas fa-temperature-high"></i>
            <div className="label">Temp Max</div>
            <div className="value">{Math.round(weather.main.temp_max)}°C</div>
          </div>
          <div className="detail-item">
            <i className="fas fa-tint"></i>
            <div className="label">Humidity</div>
            <div className="value">{weather.main.humidity}%</div>
          </div>
          <div className="detail-item">
            <i className="fas fa-wind"></i>
            <div className="label">Wind</div>
            <div className="value">{weather.wind.speed} m/s</div>
          </div>
          <div className="detail-item">
            <i className="fas fa-compress-arrows-alt"></i>
            <div className="label">Pressure</div>
            <div className="value">{weather.main.pressure} hPa</div>
          </div>
          <div className="detail-item">
            <i className="fas fa-eye"></i>
            <div className="label">Visibility</div>
            <div className="value">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}

