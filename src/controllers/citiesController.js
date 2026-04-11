const SavedCity = require('../models/SavedCity');

// @desc    Get all saved cities for logged in user
// @route   GET /api/cities
const getSavedCities = async (req, res) => {
  try {
    const cities = await SavedCity.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a new city
// @route   POST /api/cities
const saveCity = async (req, res) => {
  try {
    const { cityName, country, lat, lon } = req.body;

    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Check if already saved
    const exists = await SavedCity.findOne({
      user: req.user._id,
      cityName: cityName.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({ message: 'City already saved' });
    }

    const city = await SavedCity.create({
      user: req.user._id,
      cityName: cityName.toLowerCase(),
      country,
      lat,
      lon,
    });

    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a saved city
// @route   DELETE /api/cities/:id
const deleteCity = async (req, res) => {
  try {
    const city = await SavedCity.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Make sure the city belongs to the logged in user
    if (city.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    await city.deleteOne();
    res.json({ message: 'City removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle alert for a saved city
// @route   PUT /api/cities/:id/alert
const toggleCityAlert = async (req, res) => {
  try {
    const { alertEnabled, alertCondition } = req.body;

    const city = await SavedCity.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    if (city.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    city.alertEnabled = alertEnabled;
    city.alertCondition = alertCondition || null;
    await city.save();

    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSavedCities, saveCity, deleteCity, toggleCityAlert };
