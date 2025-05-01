// Symptom Selection Logic
const symptomSelect = document.getElementById('symptomSelect');
const otherSymptomDiv = document.getElementById('otherSymptomDiv');
const voiceInputBtn = document.getElementById('voiceInputBtn');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

symptomSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
        otherSymptomDiv.style.display = 'block';
    } else {
        otherSymptomDiv.style.display = 'none';
    }
});

// Voice Input
voiceInputBtn.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('otherSymptom').value = transcript;
    };

    recognition.onerror = (event) => {
        alert('Voice Recognition Error: ' + event.error);
    };
});

// Get Suggestions
function getSuggestions() {
    let cropName = document.getElementById('cropName').value.trim();
    let symptom = symptomSelect.value;
    if (symptom === "Other") {
        symptom = document.getElementById('otherSymptom').value.trim();
    }

    let suggestionsDiv = document.getElementById('suggestions');
    let expertsDiv = document.getElementById('experts');
    let pesticideDiv = document.getElementById('pesticideBuy');
    let notificationDiv = document.getElementById('pushNotification');
    let expiryNotification = document.getElementById('expiryNotification');

    if (!symptom || !cropName) {
        alert('Please enter crop name and select or enter a symptom!');
        return;
    }

    let suggestion = '';
    let pesticide = '';
    switch (symptom.toLowerCase()) {
        case 'yellow leaves':
            suggestion = "Possible Nitrogen Deficiency. Apply Urea Fertilizer.";
            pesticide = "Urea Fertilizer";
            break;
        case 'brown spots':
            suggestion = "Possible Fungal Infection. Apply Mancozeb Fungicide.";
            pesticide = "Mancozeb Fungicide";
            break;
        case 'wilting':
            suggestion = "Possible Bacterial Wilt. Remove infected plants immediately.";
            pesticide = "Streptomycin Sulfate";
            break;
        case 'stunted growth':
            suggestion = "Possible Zinc Deficiency. Use Zinc Sulphate fertilizer.";
            pesticide = "Zinc Sulphate";
            break;
        default:
            suggestion = "Symptom unknown. Please consult an expert immediately.";
            pesticide = "Contact Local Agriculture Officer.";
    }

    // Display AI Suggestions
    suggestionsDiv.innerHTML = `<h3>AI Suggestion for ${cropName}:</h3><p>${suggestion}</p>`;
    suggestionsDiv.style.display = 'block';

    // Experts
    expertsDiv.innerHTML = `
        <h3>Available Agriculture Experts:</h3>
        <ul>
            <li>Dr. Ravi Kumar (Soil Specialist) - 📞 9876543210</li>
            <li>Dr. Ananya Sharma (Plant Pathologist) - 📞 9123456780</li>
            <li>Mr. Suresh Patel (Farming Consultant) - 📞 9988776655</li>
        </ul>
        <button onclick="sendNotification()">Request Expert Help</button>
    `;
    expertsDiv.style.display = 'block';

    // Pesticide Shopping
    pesticideDiv.innerHTML = `
        <h3>Buy Suggested Product:</h3>
        <a href="https://www.amazon.in/s?k=${encodeURIComponent(pesticide)}" target="_blank">
            🛒 Buy ${pesticide} Online
        </a>
    `;
    pesticideDiv.style.display = 'block';

    // Show Uploaded Image
    if (imageUpload.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            imagePreview.innerHTML = `<h3>Uploaded Crop Image:</h3><img src="${e.target.result}" alt="Crop Image">`;
            imagePreview.style.display = 'block';
        };
        fileReader.readAsDataURL(imageUpload.files[0]);
    } else {
        imagePreview.innerHTML = `<p>No image uploaded.</p>`;
        imagePreview.style.display = 'block';
    }

    // Auto set expiry (1 year later)
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + 1);

    checkExpiryDate(expiryDate);
}
// Google Translate Setup
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ta,te,kn,bn,gu,mr,ml,pa',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'languageSelect'
    );
}
