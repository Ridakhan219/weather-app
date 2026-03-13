'use client';

export default function Forecast({ forecast, icons, processData }) {
  if (!forecast || !forecast.list) return null;

  const dailyData = processData(forecast.list);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="forecast-section">
      <h3 className="section-title">
        <i className="fas fa-calendar-week"></i>
        5-Day Forecast
      </h3>
      <div className="forecast-container">
        {dailyData.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = days[date.getDay()];
          const iconCode = day.weather[0].icon;
          const iconClass = icons[iconCode] || 'fa-cloud';

          return (
            <div className="forecast-day" key={index}>
              <div className="day-name">{dayName}</div>
              <div className="forecast-icon">
                <i className={`fas ${iconClass}`}></i>
              </div>
              <div className="forecast-temp">{Math.round(day.main.temp)}°</div>
              <div className="forecast-temp-low">{Math.round(day.main.temp_min)}°</div>
              <div className="forecast-condition">{day.weather[0].main}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

