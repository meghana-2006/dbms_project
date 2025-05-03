const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

// const CropRule = require('./models/CropRule');
const DiseaseReport = require('./models/diseasereports');
const YieldPrediction = require('./models/yeild_prediction');

const app = express();

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agroDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// 2. Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.dist')));

// 3. Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 4. Crop recommendation route
// app.post('/recommend', async (req, res) => {
//   const { soil_color, water_behavior } = req.body;
//   const rule = await CropRule.findOne({ soil_color, water_behavior });
//   if (rule) {
//     res.json({ recommended_crops: rule.recommended_crops });
//   } else {
//     res.json({ recommended_crops: [] });
//   }
// });

// 5. Disease report submission route
app.post('/report-disease', upload.single('symptom_image'), async (req, res) => {
  try {
    const { cropname, symptom, location, season, temperature, humidity } = req.body;
    const symptom_image = req.file ? `/uploads/${req.file.filename}` : null;

    const report = new DiseaseReport({
      cropname,
      symptom,
      location,
      season,
      temperature,
      humidity,
      symptom_image
    });

    await report.save();
    res.json({ message: '✅ Disease report submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '❌ Failed to submit report.' });
  }
});

// 6. Yield prediction route
app.post('/predict-yield', async (req, res) => {
  try {
    const { cropname, soil_type, rainfall, temperature, location } = req.body;

    const prediction = new YieldPrediction({
      cropname,
      soil_type,
      rainfall,
      temperature,
      location
    });

    await prediction.save();
    res.json({ message: '✅ Yield prediction submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to save prediction.' });
  }
});

// 7. Start server
app.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));