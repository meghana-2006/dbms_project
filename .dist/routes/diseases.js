const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer for optional image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * POST /api/diseases
 * Body: { cropName, symptom, [image] }
 * Responds with: { suggestion, pesticide }
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { cropName, symptom } = req.body;
    const image = req.file; // Optional, can be used for image analysis in future

    if (!cropName || !symptom) {
      return res.status(400).json({ error: 'Crop name and symptom are required.' });
    }

    // Basic rule-based suggestion logic (can later integrate ML or DB)
    const normalizedSymptom = symptom.trim().toLowerCase();
    let suggestion = '';
    let pesticide = '';

    switch (normalizedSymptom) {
      case 'yellow leaves':
        suggestion = 'Possible Nitrogen Deficiency. Apply Urea Fertilizer.';
        pesticide = 'Urea Fertilizer';
        break;
      case 'brown spots':
        suggestion = 'Possible Fungal Infection. Apply Mancozeb Fungicide.';
        pesticide = 'Mancozeb Fungicide';
        break;
      case 'wilting':
        suggestion = 'Possible Bacterial Wilt. Remove infected plants immediately.';
        pesticide = 'Streptomycin Sulfate';
        break;
      case 'stunted growth':
        suggestion = 'Possible Zinc Deficiency. Use Zinc Sulphate fertilizer.';
        pesticide = 'Zinc Sulphate';
        break;
      default:
        suggestion = 'Symptom unknown. Please consult an expert immediately.';
        pesticide = 'Contact Local Agriculture Officer';
        break;
    }

    res.json({ suggestion, pesticide });
  } catch (error) {
    console.error('Error handling disease suggestion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
