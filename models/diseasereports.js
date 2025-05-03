const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema({
  cropname: {
    type: String,
    required: true
  },
  symptom: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  season: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
disease_name:[String],
recommended_pesticide:[String]
});

module.exports = mongoose.model('diseasereports', diseaseReportSchema, 'disease-reports');