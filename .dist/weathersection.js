import React, { useEffect, useState } from 'react';

const WeatherSection = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your actual API key
  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
  const CITY = 'Delhi';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div id="weatherforecast" className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Weather Forecast</h2>
        {loading ? (
          <p>Loading weather...</p>
        ) : weather ? (
          <div>
            <p>
              <strong>Location:</strong> {weather.name}
            </p>
            <p>
              <strong>Temperature:</strong> {weather.main.temp}°C
            </p>
            <p>
              <strong>Condition:</strong> {weather.weather[0].description}
            </p>
          </div>
        ) : (
          <p>Failed to load weather data.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherSection;
