const mongoose = require('mongoose');

const savedCitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    lat: {
      type: Number,
    },
    lon: {
      type: Number,
    },
    alertEnabled: {
      type: Boolean,
      default: false,
    },
    alertCondition: {
      // e.g. "rain", "snow", "temp_above_30"
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedCity', savedCitySchema);
