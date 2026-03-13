<<<<<<< HEAD
'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function TemperatureChart({ forecast, processData, theme }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!forecast || !forecast.list) return;

    const dailyData = processData(forecast.list);
    const ctx = chartRef.current?.getContext('2d');
    
    if (!ctx) return;

    const labels = dailyData.map(day => {
      const date = new Date(day.dt * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const temps = dailyData.map(day => Math.round(day.main.temp));
    const tempMins = dailyData.map(day => Math.round(day.main.temp_min));
    const tempMaxs = dailyData.map(day => Math.round(day.main.temp_max));

    const isDark = theme === 'dark';
    const textColor = isDark ? '#b0b0c0' : '#4a4a6a';
    const gridColor = isDark ? 'rgba(0, 217, 255, 0.1)' : 'rgba(102, 126, 234, 0.1)';

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Max Temp',
            data: tempMaxs,
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Temp',
            data: temps,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Min Temp',
            data: tempMins,
            borderColor: '#4ecdc4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 15,
              font: {
                family: 'Poppins'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return value + '°';
              }
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forecast, processData, theme]);

  return (
    <div className="chart-section">
      <h3 className="section-title">
        <i className="fas fa-chart-line"></i>
        Temperature Trend
      </h3>
      <div className="chart-container">
        <canvas id="tempChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}

=======
'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function TemperatureChart({ forecast, processData, theme }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!forecast || !forecast.list) return;

    const dailyData = processData(forecast.list);
    const ctx = chartRef.current?.getContext('2d');
    
    if (!ctx) return;

    const labels = dailyData.map(day => {
      const date = new Date(day.dt * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const temps = dailyData.map(day => Math.round(day.main.temp));
    const tempMins = dailyData.map(day => Math.round(day.main.temp_min));
    const tempMaxs = dailyData.map(day => Math.round(day.main.temp_max));

    const isDark = theme === 'dark';
    const textColor = isDark ? '#b0b0c0' : '#4a4a6a';
    const gridColor = isDark ? 'rgba(0, 217, 255, 0.1)' : 'rgba(102, 126, 234, 0.1)';

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Max Temp',
            data: tempMaxs,
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Temp',
            data: temps,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Min Temp',
            data: tempMins,
            borderColor: '#4ecdc4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 15,
              font: {
                family: 'Poppins'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return value + '°';
              }
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forecast, processData, theme]);

  return (
    <div className="chart-section">
      <h3 className="section-title">
        <i className="fas fa-chart-line"></i>
        Temperature Trend
      </h3>
      <div className="chart-container">
        <canvas id="tempChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}

>>>>>>> 43126c96babf3afbbcccf11101a80700601a7caa
