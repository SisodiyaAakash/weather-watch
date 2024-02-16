import React, { useState, useEffect } from 'react';
import MyLocationIcon from '../assets/media/icons/location.svg';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(true);
  const [scrollClass, setScrollClass] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeatherData = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition >= 100) {
      setScrollClass('scrolled');
    } else {
      setScrollClass('');
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }

    // For scroll 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
                <div className={`weather-info-head ${scrollClass}`}>
                  <h3>{city}</h3>

                  <div className="temperature-toggler">
                    <input
                      type="radio"
                      id="fahrenheit"
                      name="temperatureUnit"
                      value="fahrenheit"
                      checked={isFahrenheit}
                      onChange={() => setIsFahrenheit(true)}
                    />
                    <label htmlFor="fahrenheit" className={isFahrenheit ? "active" : ""}>F<span>ahrenheit</span></label>

                    <input
                      type="radio"
                      id="celsius"
                      name="temperatureUnit"
                      value="celsius"
                      checked={!isFahrenheit}
                      onChange={() => setIsFahrenheit(false)}
                    />
                    <label htmlFor="celsius" className={!isFahrenheit ? "active" : ""}>C<span>elsius</span></label>
                  </div>
                </div>
                <div className='date-based-list'>
                  {Object.entries(groupWeatherByDay()).map(([date, forecasts]) => {
                    // Convert date string to Date object
                    const dateObj = new Date(date);

                    // Define months array for mapping month numbers to month names
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    // Format the date to "DD Mon YYYY" format
                    const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

                    return (
                      <div className='date-list-itm' key={date}>
                        <p className='date-heading'>{formattedDate}</p>
                        <div className='weather-card-grid'>
                          {forecasts.map((forecast, index) => {
                            const timeString = forecast.dt_txt.split(' ')[1];
                            const formattedTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                            const [hour, minute] = formattedTime.split(':');
                            const period = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: 'numeric', hour12: true }).split(' ')[1];

                            return (
                              <div className='weather-card' key={index}>
                                <div className='date-temp'>
                                  <h6 className='date'>{hour}:{minute}</h6>
                                  <h6 className='temp'>{isFahrenheit ? convertToFahrenheit(forecast.main.temp) + "° F" : (forecast.main.temp - 273.15).toFixed(2) + "° C"}</h6>
                                </div>
                                <h5 className='desc'>{forecast.weather[0].description}</h5>
                                {forecast.weather[0].icon && (
                                  <img className='weather-icon' src={getWeatherIconUrl(forecast.weather[0].icon)} alt="Weather Icon" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className='info-inner-wrap text-center'>
                <h4>Check weather now</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
