const DiseaseReport = require('../models/DiseaseReport');

exports.getDiseases = async (req, res) => {
  try {
    const reports = await DiseaseReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disease reports' });
  }
};

exports.createDisease = async (req, res) => {
  try {
    const report = new DiseaseReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create disease report' });
  }
};