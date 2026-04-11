const express = require('express');
const router = express.Router();
const {
  getSavedCities,
  saveCity,
  deleteCity,
  toggleCityAlert,
} = require('../controllers/citiesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSavedCities);
router.post('/', protect, saveCity);
router.delete('/:id', protect, deleteCity);
router.put('/:id/alert', protect, toggleCityAlert);

module.exports = router;
