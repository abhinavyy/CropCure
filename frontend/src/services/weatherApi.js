// services/weatherApi.js

const API_KEY = '2a3260f0a33bcf30533a6337cb0ccd06'; // Your AgroMonitoring API key
const API_BASE = 'https://api.agromonitoring.com/agro/1.0';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return response.json();
};

// Get coordinates for a location (using a geocoding service)
const getCoordinates = async (location) => {
  try {
    // Using OpenStreetMap Nominatim for geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Fetch current weather data
export const getCurrentWeather = async (state, district) => {
  try {
    const location = `${district}, ${state}, India`;
    const coordinates = await getCoordinates(location);
    
    const response = await fetch(`${API_BASE}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`);
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch soil data
export const getSoilData = async (state, district) => {
  try {
    const location = `${district}, ${state}, India`;
    const coordinates = await getCoordinates(location);
    
    const response = await fetch(`${API_BASE}/soil?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`);
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw error;
  }
};

// Fetch forecast data
export const getForecast = async (state, district) => {
  try {
    const location = `${district}, ${state}, India`;
    const coordinates = await getCoordinates(location);
    
    const response = await fetch(`${API_BASE}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`);
    
    const data = await handleResponse(response);
    
    // Format the forecast data for our component
    return data.map((item, index) => ({
      day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`,
      condition: item.weather[0].main,
      minTemp: Math.round(item.temp.min - 273.15), // Convert from Kelvin to Celsius
      maxTemp: Math.round(item.temp.max - 273.15), // Convert from Kelvin to Celsius
      rainChance: item.pop * 100 // Probability of precipitation
    }));
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};