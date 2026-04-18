const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'open-weather13.p.rapidapi.com';

// @desc    Get current weather by city name
// @route   GET /api/weather/current/:city
const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params;

    const response = await axios.get(
      `https://open-weather13.p.rapidapi.com/city?city=${city}&lang=EN&units=metric`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        },
      }
    );

    const data = response.data;

    // Format the response into something clean for the app
    const weather = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      lat: data.coord.lat,
      lon: data.coord.lon,
    };

    res.json(weather);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get 5-day forecast by city name
// @route   GET /api/weather/forecast/:city
const getForecast = async (req, res) => {
  try {
    const { city } = req.params;

    // First get coordinates from current weather
    const weatherResponse = await axios.get(
      `https://open-weather13.p.rapidapi.com/city?city=${city}&lang=EN&units=metric`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        },
      }
    );

    const { coord } = weatherResponse.data;

    // Then get forecast using coordinates
    const response = await axios.get(
      `https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=${coord.lat}&longitude=${coord.lon}&lang=EN&units=metric`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        },
      }
    );

    const data = response.data;

    const grouped = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push({
        time: item.dt_txt.split(' ')[1],
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
      });
    });

    res.json({
      city: data.city.name,
      country: data.city.country,
      forecast: grouped,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCurrentWeather, getForecast };
