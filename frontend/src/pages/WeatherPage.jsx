import React, { useState, useEffect } from 'react';
import { getCurrentWeather, getSoilData, getForecast } from '../services/weatherApi';

const WeatherPage = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [apiConnected, setApiConnected] = useState(true);

  // Indian states and districts
  const indianStates = [
    {
      name: 'Andaman and Nicobar Islands',
      districts: ['Port Blair', 'Digipur', 'Mayabunder', 'Car Nicobar']
    },
    {
      name: 'Andhra Pradesh',
      districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kadapa']
    },
    {
      name: 'Uttar Pradesh',
      districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Ghaziabad', 'Noida']
    },
    {
      name: 'Uttarakhand',
      districts: ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie', 'Haldwani']
    },
    {
      name: 'West Bengal',
      districts: ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Darjeeling', 'Kharagpur']
    }
  ];

  useEffect(() => {
    // Reset district when state changes
    setSelectedDistrict('');
  }, [selectedState]);

  const handleGetWeather = async () => {
    if (!selectedState || !selectedDistrict) {
      setError('Please select both state and district');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use Promise.all to fetch all data in parallel
      const [weatherResponse, soilResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(selectedState, selectedDistrict),
        getSoilData(selectedState, selectedDistrict),
        getForecast(selectedState, selectedDistrict)
      ]);

      setWeatherData(weatherResponse);
      setSoilData(soilResponse);
      setForecastData(forecastResponse);
      setApiConnected(true);
      
    } catch (err) {
      setError('');
      console.error('API Error:', err);
      
      // If API fails, use simulated data
      try {
        await simulateWeatherAPI();
        await simulateSoilAPI();
        await simulateForecastAPI();
        setApiConnected(false);
      } catch (fallbackError) {
        setError('');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulation Functions (Fallback)
  const simulateWeatherAPI = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const temperature = 20 + Math.floor(Math.random() * 15);
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        setWeatherData({
          temperature,
          condition,
          humidity: 40 + Math.floor(Math.random() * 40),
          windSpeed: (5 + Math.floor(Math.random() * 15)) + ' km/h',
          precipitation: Math.floor(Math.random() * 10) + ' mm',
          pressure: (1000 + Math.floor(Math.random() * 20)) + ' hPa',
        });
        resolve();
      }, 1000);
    });
  };

  const simulateSoilAPI = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSoilData({
          temperature: 18 + Math.floor(Math.random() * 10),
          moisture: 30 + Math.floor(Math.random() * 50),
          pH: (6.0 + (Math.random() * 1.5)).toFixed(1),
          nitrogen: (20 + Math.floor(Math.random() * 60)) + ' kg/ha',
          phosphorus: (10 + Math.floor(Math.random() * 30)) + ' kg/ha',
          potassium: (15 + Math.floor(Math.random() * 40)) + ' kg/ha',
        });
        resolve();
      }, 1200);
    });
  };

  const simulateForecastAPI = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const days = ['Today', 'Tomorrow', 'Day after'];
        const forecast = days.map((day) => {
          const minTemp = 18 + Math.floor(Math.random() * 5);
          const maxTemp = minTemp + 5 + Math.floor(Math.random() * 5);
          const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
          return {
            day,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            minTemp,
            maxTemp,
            rainChance: Math.floor(Math.random() * 30),
          };
        });
        setForecastData(forecast);
        resolve();
      }, 1500);
    });
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return 'fas fa-sun';
      case 'Partly Cloudy': return 'fas fa-cloud-sun';
      case 'Cloudy': return 'fas fa-cloud';
      case 'Light Rain': return 'fas fa-cloud-rain';
      default: return 'fas fa-sun';
    }
  };

  // API Status Indicator Component
  const ApiStatusIndicator = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.8rem',
      color: apiConnected ? '#2ecc71' : '#e74c3c',
      fontWeight: '500',
      zIndex: 10
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: apiConnected ? '#2ecc71' : '#e74c3c'
      }}></div>
      {apiConnected ? 'API Connected' : 'Using Simulated Data'}
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

          :root {
            --primary-green: #2ecc71;
            --secondary-green: #27ae60;
            --dark-text: #34495e;
            --light-text: #7f8c8d;
            --bg-color: #f4f7f6;
            --card-bg: #ffffff;
            --shadow-color: rgba(0, 0, 0, 0.1);
          }

          .agro-weather-container {
            font-family: 'Roboto', sans-serif;
            background: var(--bg-color);
            color: var(--dark-text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            position: relative;
            box-sizing: border-box;
            margin-top: 70px; 
          }

          .background-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.1;
            z-index: 0;
          }

          .redesigned-header {
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 2rem;
            position: relative;
            z-index: 1;
          }

          .redesigned-logo {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .redesigned-logo .icon {
            font-size: 2.5rem;
            color: var(--primary-green);
          }

          .redesigned-logo .text h1 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--dark-text);
            margin: 0;
          }

          .redesigned-logo .text span {
            font-size: 0.9rem;
            font-weight: 400;
            color: var(--light-text);
          }
          
          .redesigned-main-content {
            width: 100%;
            max-width: 1200px;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            position: relative;
            z-index: 1;
          }

          .redesigned-card {
            background: var(--card-bg);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 8px 20px var(--shadow-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .redesigned-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
          }

          .card-header-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 1rem;
          }

          .card-title-main {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--dark-text);
          }

          .card-icon-main {
            font-size: 2.2rem;
            color: var(--primary-green);
          }

          .location-selection {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .select-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .location-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #dfe6e9;
            border-radius: 0.5rem;
            background-color: #f7f9fb;
            color: var(--dark-text);
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%237f8c8d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' class='w-5 h-5'%3e%3cpath d='M6 9l4 4 4-4'%3e%3c/path%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1.5em;
          }

          .location-select:focus {
            outline: none;
            border-color: var(--primary-green);
            box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
          }

          .location-select:disabled {
            background-color: #eef1f3;
            cursor: not-allowed;
            color: var(--light-text);
          }

          .redesigned-button {
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            border: none;
            font-size: 1rem;
            color: white;
            background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
            box-shadow: 0 4px 10px rgba(46, 204, 113, 0.4);
          }

          .redesigned-button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(46, 204, 113, 0.6);
          }

          .redesigned-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
            background: #bdc3c7;
            box-shadow: none;
            transform: none;
          }

          .error-message {
            padding: 1rem;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            text-align: center;
            font-weight: 500;
            background-color: #fdeaea;
            border: 1px solid #f8d7da;
            color: #721c24;
          }

          .redesigned-dashboard {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          @media (min-width: 768px) {
            .redesigned-dashboard {
              grid-template-columns: 2fr 1fr;
            }
          }
          
          .grid-section-1 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
          }

          .grid-section-2 {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .current-weather-main {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .weather-temp {
            font-size: 4.5rem;
            font-weight: 700;
            color: var(--primary-green);
            line-height: 1;
          }
          
          .weather-temp span {
            font-size: 2rem;
            vertical-align: super;
          }
          
          .weather-condition {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--dark-text);
            text-transform: capitalize;
          }

          .current-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .detail-item {
            background: #f7f9fb;
            padding: 1rem;
            border-radius: 0.75rem;
            text-align: center;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
            transition: background 0.2s;
          }

          .detail-item:hover {
            background: #eef1f3;
          }

          .detail-icon {
            font-size: 1.5rem;
            color: var(--light-text);
            margin-bottom: 0.5rem;
          }

          .detail-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark-text);
          }
          
          .detail-label {
            font-size: 0.8rem;
            color: var(--light-text);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .forecast-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .forecast-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            border-radius: 0.75rem;
            background: #f7f9fb;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
            transition: transform 0.2s;
          }
          
          .forecast-item:hover {
            transform: translateY(-2px);
          }
          
          .forecast-day {
            font-weight: 500;
            color: var(--dark-text);
            flex: 1;
          }

          .forecast-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 2;
          }
          
          .forecast-icon {
            font-size: 1.5rem;
            color: #63b3ed;
          }
          
          .forecast-condition {
            font-size: 0.9rem;
            color: var(--light-text);
          }
          
          .forecast-temp {
            font-weight: 600;
            color: var(--dark-text);
            margin-left: auto;
          }

          .rain-chance {
            font-size: 0.9rem;
            color: #3498db;
            font-weight: 500;
          }

          .soil-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .soil-item {
            background: #f7f9fb;
            padding: 1rem;
            border-radius: 0.75rem;
            text-align: center;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
            transition: background 0.2s;
          }

          .soil-item:hover {
            background: #eef1f3;
          }

          .soil-item .icon {
            font-size: 1.5rem;
            color: #d35400;
            margin-bottom: 0.5rem;
          }

          .soil-value {
            font-weight: 600;
            color: var(--dark-text);
          }

          .soil-label {
            font-size: 0.8rem;
            color: var(--light-text);
            text-transform: uppercase;
          }

          .no-data {
            text-align: center;
            color: var(--light-text);
            font-style: italic;
            padding: 2rem;
          }
        `}
      </style>
      <div className="agro-weather-container">
        <ApiStatusIndicator />
        <div className="background-grid"></div>
        <header className="redesigned-header">
            <div className="redesigned-logo">
                <i className="fas fa-seedling icon"></i>
                <div className="text">
                    <h1>CropCure Weather</h1>
                    <span>Smart Farming Weather Portal</span>
                </div>
            </div>
        </header>
        <div className="redesigned-main-content">
            <div className="redesigned-card">
                <div className="card-header-main">
                    <h2 className="card-title-main">Select Your Farm Location</h2>
                    <i className="fas fa-map-marker-alt card-icon-main"></i>
                </div>
                <div className="location-selection">
                    <div className="select-group">
                        <label htmlFor="state-select">State</label>
                        <select
                            id="state-select"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="location-select"
                        >
                            <option value="">Select State</option>
                            {indianStates.map(state => (
                                <option key={state.name} value={state.name}>{state.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="select-group">
                        <label htmlFor="district-select">District</label>
                        <select
                            id="district-select"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="location-select"
                            disabled={!selectedState}
                        >
                            <option value="">Select District</option>
                            {selectedState && indianStates
                                .find(state => state.name === selectedState)
                                .districts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="select-group" style={{ gridColumn: 'span 2' }}>
                        <button
                            className="redesigned-button"
                            onClick={handleGetWeather}
                            disabled={!selectedState || !selectedDistrict || loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Loading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-search"></i> Get Weather
                                </>
                            )}
                        </button>
                    </div>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
            {weatherData && (
                <div className="redesigned-dashboard">
                    <div className="grid-section-1">
                        <div className="redesigned-card">
                            <div className="card-header-main">
                                <h3 className="card-title-main">Current Weather</h3>
                                <i className={getWeatherIcon(weatherData.condition)} style={{ color: '#f1c40f' }}></i>
                            </div>
                            <div className="current-weather-main">
                                <div style={{ textAlign: 'center' }}>
                                    <div className="weather-temp">
                                        {weatherData.temperature}<span>°C</span>
                                    </div>
                                    <div className="weather-condition">{weatherData.condition}</div>
                                </div>
                                <div className="current-details-grid">
                                    <div className="detail-item">
                                        <i className="fas fa-tint detail-icon"></i>
                                        <div className="detail-value">{weatherData.humidity}%</div>
                                        <div className="detail-label">Humidity</div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-wind detail-icon"></i>
                                        <div className="detail-value">{weatherData.windSpeed}</div>
                                        <div className="detail-label">Wind</div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-cloud-rain detail-icon"></i>
                                        <div className="detail-value">{weatherData.precipitation}</div>
                                        <div className="detail-label">Precipitation</div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-tachometer-alt detail-icon"></i>
                                        <div className="detail-value">{weatherData.pressure}</div>
                                        <div className="detail-label">Pressure</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="redesigned-card">
                            <div className="card-header-main">
                                <h3 className="card-title-main">3-Day Forecast</h3>
                                <i className="fas fa-calendar-alt card-icon-main"></i>
                            </div>
                            <div className="forecast-list">
                                {forecastData.length > 0 ? (
                                    forecastData.map((day) => (
                                        <div key={day.day} className="forecast-item">
                                            <div className="forecast-day">{day.day}</div>
                                            <div className="forecast-info">
                                                <i className={`${getWeatherIcon(day.condition)} forecast-icon`}></i>
                                                <div className="forecast-condition">{day.condition}</div>
                                            </div>
                                            <div className="forecast-temp">
                                                {day.maxTemp}° / {day.minTemp}°
                                            </div>
                                            <div className="rain-chance">
                                                <i className="fas fa-tint" style={{ marginRight: '5px' }}></i>
                                                {day.rainChance}%
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data">Forecast data not available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid-section-2">
                        <div className="redesigned-card">
                            <div className="card-header-main">
                                <h3 className="card-title-main">Soil Metrics</h3>
                                <i className="fas fa-mountain card-icon-main" style={{ color: '#d35400' }}></i>
                            </div>
                            <div className="soil-grid">
                                {soilData ? (
                                    <>
                                        <div className="soil-item">
                                            <i className="fas fa-thermometer-half icon"></i>
                                            <div className="soil-value">{soilData.temperature}°C</div>
                                            <div className="soil-label">Temperature</div>
                                        </div>
                                        <div className="soil-item">
                                            <i className="fas fa-water icon"></i>
                                            <div className="soil-value">{soilData.moisture}%</div>
                                            <div className="soil-label">Moisture</div>
                                        </div>
                                        <div className="soil-item">
                                            <i className="fas fa-vial icon"></i>
                                            <div className="soil-value">{soilData.pH}</div>
                                            <div className="soil-label">pH Level</div>
                                        </div>
                                        <div className="soil-item">
                                            <i className="fas fa-flask icon"></i>
                                            <div className="soil-value">{soilData.nitrogen}</div>
                                            <div className="soil-label">Nitrogen</div>
                                        </div>
                                        <div className="soil-item">
                                            <i className="fas fa-flask icon"></i>
                                            <div className="soil-value">{soilData.phosphorus}</div>
                                            <div className="soil-label">Phosphorus</div>
                                        </div>
                                        <div className="soil-item">
                                            <i className="fas fa-flask icon"></i>
                                            <div className="soil-value">{soilData.potassium}</div>
                                            <div className="soil-label">Potassium</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="no-data" style={{ gridColumn: 'span 2' }}>Soil data not available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    </>
  );
};

export default WeatherPage;