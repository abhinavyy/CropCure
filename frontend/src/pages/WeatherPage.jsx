import React, { useState, useEffect, useMemo } from 'react';
import { getCurrentWeather, getSoilData, getForecast } from '../services/weatherApi';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import './WeatherPage.css';

const WeatherPage = () => {
  const { t } = useLanguage();
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
    { name: 'Andaman and Nicobar Islands', districts: ['Port Blair', 'Diglipur', 'Mayabunder', 'Car Nicobar'] },
    { name: 'Andhra Pradesh', districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kadapa', 'Anantapur'] },
    { name: 'Arunachal Pradesh', districts: ['Itanagar', 'Tawang', 'Ziro', 'Pasighat', 'Bomdila', 'Along'] },
    { name: 'Assam', districts: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'] },
    { name: 'Bihar', districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah'] },
    { name: 'Chandigarh', districts: ['Chandigarh'] },
    { name: 'Chhattisgarh', districts: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur'] },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', districts: ['Daman', 'Diu', 'Silvassa'] },
    { name: 'Delhi', districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'] },
    { name: 'Goa', districts: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'] },
    { name: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh'] },
    { name: 'Haryana', districts: ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'] },
    { name: 'Himachal Pradesh', districts: ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur'] },
    { name: 'Jammu and Kashmir', districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur'] },
    { name: 'Jharkhand', districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih'] },
    { name: 'Karnataka', districts: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere'] },
    { name: 'Kerala', districts: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur'] },
    { name: 'Ladakh', districts: ['Leh', 'Kargil'] },
    { name: 'Lakshadweep', districts: ['Kavaratti'] },
    { name: 'Madhya Pradesh', districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna'] },
    { name: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati'] },
    { name: 'Manipur', districts: ['Imphal', 'Churachandpur', 'Thoubal', 'Ukhrul', 'Senapati'] },
    { name: 'Meghalaya', districts: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar'] },
    { name: 'Mizoram', districts: ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib'] },
    { name: 'Nagaland', districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'] },
    { name: 'Odisha', districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'] },
    { name: 'Puducherry', districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
    { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'] },
    { name: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar'] },
    { name: 'Sikkim', districts: ['Gangtok', 'Namchi', 'Geyzing', 'Mangan'] },
    { name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode'] },
    { name: 'Telangana', districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahabubnagar'] },
    { name: 'Tripura', districts: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Ambassa'] },
    { name: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Ghaziabad', 'Noida'] },
    { name: 'Uttarakhand', districts: ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie', 'Haldwani', 'Roorkee'] },
    { name: 'West Bengal', districts: ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Darjeeling', 'Kharagpur', 'Malda'] }
  ];

  useEffect(() => {
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
      console.error('API Error:', err);
      // Fallback to simulation
      await simulateAllData();
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const simulateAllData = async () => {
    // Simulate current weather
    const temperature = 22 + Math.floor(Math.random() * 12);
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    setWeatherData({
      temperature,
      condition,
      humidity: 45 + Math.floor(Math.random() * 35),
      windSpeed: (8 + Math.floor(Math.random() * 12)) + ' km/h',
      precipitation: Math.floor(Math.random() * 5) + ' mm',
      pressure: (1010 + Math.floor(Math.random() * 10)) + ' hPa',
    });

    // Simulate soil
    setSoilData({
      temperature: 20 + Math.floor(Math.random() * 8),
      moisture: 35 + Math.floor(Math.random() * 45),
      pH: (6.2 + (Math.random() * 1.2)).toFixed(1),
      nitrogen: (30 + Math.floor(Math.random() * 50)) + ' kg/ha',
      phosphorus: (15 + Math.floor(Math.random() * 25)) + ' kg/ha',
      potassium: (20 + Math.floor(Math.random() * 35)) + ' kg/ha',
    });

    // Simulate forecast
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const forecast = days.map((day) => {
      const minTemp = 19 + Math.floor(Math.random() * 4);
      const maxTemp = minTemp + 6 + Math.floor(Math.random() * 6);
      return {
        day,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        minTemp,
        maxTemp,
        rainChance: Math.floor(Math.random() * 40),
      };
    });
    setForecastData(forecast);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return 'fas fa-sun text-yellow-400';
      case 'Partly Cloudy': return 'fas fa-cloud-sun text-gray-400';
      case 'Cloudy': return 'fas fa-cloud text-gray-500';
      case 'Light Rain': return 'fas fa-cloud-rain text-blue-400';
      case 'Rain': return 'fas fa-cloud-showers-heavy text-blue-600';
      default: return 'fas fa-sun text-yellow-400';
    }
  };

  const chartData = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return [];
    return forecastData.map(d => ({
      name: d.day,
      temp: d.maxTemp
    }));
  }, [forecastData]);

  return (
    <div className="weather-page">
      <Navbar />
      <section className="weather-hero">
        <h1>🌿 {t('weatherHeroTitle') || 'CropCure Weather Portal'}</h1>
        <p>Real-time meteorological insights for precision agriculture.</p>
      </section>

      <main className="weather-container">

        <section className="glass-card location-card">
          <div className="api-status">
            <span className={`dot ${apiConnected ? 'connected' : 'simulated'}`}></span>
            {apiConnected ? 'System Online' : 'Simulation Mode'}
          </div>
          
          <div className="location-grid">
            <div className="input-group">
              <label>State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="custom-select"
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state.name} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="custom-select"
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

            <button
              className="search-btn"
              onClick={handleGetWeather}
              disabled={!selectedState || !selectedDistrict || loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-search-location"></i>
                  <span>Check Forecast</span>
                </>
              )}
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </section>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Gathering satellite data...</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className="weather-dashboard animate-in">
            <div className="main-weather-section">
              {/* Current Weather */}
              <div className="glass-card current-weather-card">
                <div className="weather-info-primary">
                  <h2>{selectedDistrict}, {selectedState}</h2>
                  <div className="temp-display">
                    {weatherData.temperature}<span>°C</span>
                  </div>
                  <div className="condition-text">
                    <i className={getWeatherIcon(weatherData.condition)}></i>
                    <span style={{ marginLeft: '10px' }}>{weatherData.condition}</span>
                  </div>
                </div>
                <div className="weather-visual">
                  <i className={getWeatherIcon(weatherData.condition)} 
                     style={{ color: weatherData.condition === 'Sunny' ? '#f1c40f' : '#95a5a6' }}>
                  </i>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <div className="metric-item">
                  <i className="fas fa-tint"></i>
                  <span className="metric-value">{weatherData.humidity}%</span>
                  <span className="metric-label">Humidity</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-wind"></i>
                  <span className="metric-value">{weatherData.windSpeed}</span>
                  <span className="metric-label">Wind</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-cloud-showers-heavy"></i>
                  <span className="metric-value">{weatherData.precipitation}</span>
                  <span className="metric-label">Rainfall</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-compress-arrows-alt"></i>
                  <span className="metric-value">{weatherData.pressure}</span>
                  <span className="metric-label">Pressure</span>
                </div>
              </div>

              {/* Temperature Chart */}
              <div className="glass-card chart-card">
                <h3><i className="fas fa-chart-line"></i> Temperature Trend</h3>
                <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7f8c8d', fontSize: 12}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#2ecc71', fontWeight: 700 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="temp" 
                        stroke="#2ecc71" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorTemp)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="sidebar-section" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Soil Metrics */}
              <div className="glass-card soil-card">
                <h3><i className="fas fa-seedling"></i> Soil Health</h3>
                <div className="soil-grid">
                  <div className="soil-metric">
                    <i className="fas fa-thermometer-half"></i>
                    <span className="metric-value">{soilData?.temperature}°C</span>
                    <span className="metric-label">Soil Temp</span>
                  </div>
                  <div className="soil-metric">
                    <i className="fas fa-water"></i>
                    <span className="metric-value">{soilData?.moisture}%</span>
                    <span className="metric-label">Moisture</span>
                  </div>
                  <div className="soil-metric">
                    <i className="fas fa-vial"></i>
                    <span className="metric-value">{soilData?.pH}</span>
                    <span className="metric-label">pH Level</span>
                  </div>
                  <div className="soil-metric">
                    <i className="fas fa-flask"></i>
                    <span className="metric-value">{soilData?.nitrogen}</span>
                    <span className="metric-label">Nitrogen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WeatherPage;