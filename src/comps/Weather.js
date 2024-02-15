import React, { useState, useEffect } from 'react';
import MyLocationIcon from '../assets/media/icons/location.svg';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(true);
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeatherData = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
            setCity(response.data.name);
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const convertToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2); // Convert to Fahrenheit and round to 2 decimal places
  };

  const handleToggleUnit = () => {
    setIsFahrenheit(prevState => !prevState);
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  const groupWeatherByDay = () => {
    const groupedWeather = {};
    if (weatherData) {
      weatherData.list.forEach((forecast) => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!groupedWeather[date]) {
          groupedWeather[date] = [];
        }
        groupedWeather[date].push(forecast);
      });
    }
    return groupedWeather;
  };

  return (
    <div className="weather-app">
      <div className='container'>
        <div className='safe-area'>
          <form className='form-wrap'>
            <input
              type="text"
              value={city}
              onChange={handleChange}
              placeholder="Enter your city name"
            />
            <button type='button' onClick={handleGetCurrentLocation}>
              <img src={MyLocationIcon} alt="My Location" />
            </button>
          </form>
          <div className='weather-info-wrap'>
            {weatherData ? (
              <div className='info-inner-wrap'>
                <div className='weather-info-head'>
                  <h3>{city}</h3>

                  <div className="temperature-toggler">
                    <input
                      type="radio"
                      id="fahrenheit"
                      name="temperatureUnit"
                      value="fahrenheit"
                      checked={!isFahrenheit}
                      onChange={() => setIsFahrenheit(false)}
                    />
                    <label htmlFor="fahrenheit">Fahrenheit</label>

                    <input
                      type="radio"
                      id="celsius"
                      name="temperatureUnit"
                      value="celsius"
                      checked={isFahrenheit}
                      onChange={() => setIsFahrenheit(true)}
                    />
                    <label htmlFor="celsius">Celsius</label>
                  </div>
                </div>
                <div className='date-based-list'>
                  {Object.entries(groupWeatherByDay()).map(([date, forecasts]) => (
                    <div className='date-list-itm' key={date}>
                      <h5>{date}</h5>
                      {forecasts.map((forecast, index) => (
                        <div className='weather-card' key={index}>
                          <p>{forecast.dt_txt}</p>
                          <p>{isFahrenheit ? convertToFahrenheit(forecast.main.temp) + "° F" : (forecast.main.temp - 273.15).toFixed(2) + "° C"}</p>
                          <p>{forecast.weather[0].description}</p>
                          {forecast.weather[0].icon && (
                            <img src={getWeatherIconUrl(forecast.weather[0].icon)} alt="Weather Icon" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='info-inner-wrap text-center'>
                <h4>Check your weather now</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
