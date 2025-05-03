const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const DiseaseReport = require('../models/diseasereports'); // Make sure this path is correct

async function seedDiseaseReports() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agrodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding disease reports');

    const dataPath = path.join(__dirname, 'agrodb.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const diseaseData = JSON.parse(jsonData);

    const result = await DiseaseReport.insertMany(diseaseData);
    console.log(`✅ Inserted ${result.length} disease report entries.`);

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seeding disease reports failed:', err);
  }
}

seedDiseaseReports();