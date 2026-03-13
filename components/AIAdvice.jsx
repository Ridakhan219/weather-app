'use client';

export default function AIAdvice({ weather }) {
  if (!weather) return null;

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const weatherMain = weather.weather[0].main.toLowerCase();
  const windSpeed = weather.wind.speed;

  const advice = [];

  // Temperature-based advice
  if (temp < 0) {
    advice.push("🥶 It's freezing! Bundle up with multiple layers, warm coat, gloves, and a hat.");
  } else if (temp < 10) {
    advice.push("🧥 It's quite cold. Wear a warm jacket and consider layering.");
  } else if (temp < 20) {
    advice.push("👕 Pleasant temperature. A light jacket or sweater would be ideal.");
  } else if (temp < 30) {
    advice.push("☀️ Great weather! Wear comfortable, breathable clothing.");
  } else {
    advice.push("🔥 It's hot! Stay hydrated and wear light, loose-fitting clothes.");
  }

  // Weather condition advice
  if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
    advice.push("🌧️ Don't forget your umbrella - it's raining!");
  } else if (weatherMain.includes('thunderstorm')) {
    advice.push("⛈️ Thunderstorms expected. Stay indoors and avoid open areas.");
  } else if (weatherMain.includes('snow')) {
    advice.push("❄️ Snowy conditions! Wear waterproof boots and be careful on roads.");
  } else if (weatherMain.includes('fog') || weatherMain.includes('mist')) {
    advice.push("🌫️ Low visibility due to fog. Drive carefully!");
  } else if (weatherMain.includes('clear') && temp > 25) {
    advice.push("🧴 Sunny and warm - don't forget sunscreen!");
  }

  // Humidity advice
  if (humidity > 80) {
    advice.push("💧 High humidity may feel uncomfortable. Stay in air-conditioned spaces if possible.");
  } else if (humidity < 30) {
    advice.push("💨 Low humidity - stay moisturized and drink plenty of water.");
  }

  // Wind advice
  if (windSpeed > 10) {
    advice.push("💨 It's windy! Secure loose items outdoors and be careful when cycling.");
  }

  // Activity suggestion
  if (weatherMain.includes('clear') || weatherMain.includes('clouds')) {
    if (temp >= 15 && temp <= 25) {
      advice.push("🏃 Perfect weather for outdoor activities and exercise!");
    }
  } else if (weatherMain.includes('rain') || weatherMain.includes('storm')) {
    advice.push("🏠 Great day for indoor activities like reading or gaming.");
  }

  return (
    <div className="ai-advice">
      <div className="advice-header">
        <i className="fas fa-robot"></i>
        <h3>AI Weather Advice</h3>
      </div>
      <p className="advice-text">
        {advice.map((item, index) => (
          <span key={index}>
            {item}
            {index < advice.length - 1 && <><br /><br /></>}
          </span>
        ))}
      </p>
    </div>
  );
}

