const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema({
  cropname: {
    type: String,
    required: true
  },
  soil_type: {
    type: String,
    enum: ['black', 'red', 'loamy', 'clay', 'sandy'], // You can customize or remove enum
    required: true
  },
  rainfall: {
    type: Number, // in mm
    required: true
  },
  temperature: {
    type: Number, // in °C
    required: true
  },
  location: {
    type: String,
    required: true
  },
  predicted_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('yield_prediction', yieldPredictionSchema, 'yield-predictions');