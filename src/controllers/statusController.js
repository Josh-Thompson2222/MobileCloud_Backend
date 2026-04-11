// @desc    Health check
// @route   GET /api/status
const getStatus = (req, res) => {
  res.json({
    status: 'OK',
    message: 'Weather App API is running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getStatus };
