const DiseaseReportSchema = new mongoose.Schema({
    crop: String,
    diseaseName: String,
    severity: String,
    reportDate: { type: Date, default: Date.now },
    notes: String
  });
  
  module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);