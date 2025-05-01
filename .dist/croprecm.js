// Event listener for form submit
document.getElementById('farmerFriendlyForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const soil = document.getElementById('soil_color').value === 'other' ? document.getElementById('soil_other').value : document.getElementById('soil_color').value;
    const water = document.getElementById('water_behavior').value === 'other' ? document.getElementById('water_other').value : document.getElementById('water_behavior').value;
    const lastCrop = document.getElementById('last_crop').value === 'other' ? document.getElementById('crop_other').value : document.getElementById('last_crop').value;
    const rainfall = document.getElementById('rainfall').value;
    const temp = document.getElementById('temperature').value;

    // First do manual recommendation
    let crop = "Soybean"; // Default
    if (soil === 'black' && rainfall === 'heavy') {
        crop = "Rice";
    } else if (soil === 'red' && temp === 'hot') {
        crop = "Cotton";
    } else if (soil.includes('sandy') && rainfall === 'low') {
        crop = "Millets";
    }

    // Display manual expert recommendation
    document.getElementById('manualRecommendation').innerText = `✅ Manual Recommendation: ${crop}`;

    // Then try AI Recommendation
    const prompt = `Suggest suitable crops for the following conditions:
    - Soil Type: ${soil}
    - Water Behavior: ${water}
    - Last Crop Grown: ${lastCrop}
    - Rainfall: ${rainfall}
    - Temperature: ${temp} degree Celsius.
    Provide 2-3 best crop options and a short reason why they are suitable.`;

    const apiKey = 'YOUR_OPENAI_API_KEY';  // Replace with your OpenAI API Key
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        document.getElementById('aiRecommendation').innerText = `🤖 AI Recommendation:\n${aiReply}`;
    } catch (error) {
        console.error('Error fetching AI suggestion:', error);
        document.getElementById('aiRecommendation').innerText = "⚠ Failed to fetch AI recommendation.";
    }
    try {
        document.getElementById('resultSection').style.display = 'block';
    } catch (error) {
        console.error('Error displaying result section:', error);
    }
    document.getElementById('resultSection').style.display = 'block';
});

// Show "Other" input when selected
function checkOther(selectElement, inputId) {
    const otherInput = document.getElementById(inputId);
    if (selectElement.value === 'other') {
        otherInput.style.display = 'block';
        otherInput.required = true;
    } else {
        otherInput.style.display = 'none';
        otherInput.required = false;
    }
}

// Speak text using SpeechSynthesis
function speakText() {
    const text = document.getElementById('speak-text').value;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi language
    speechSynthesis.speak(utterance);
}

// Predict crop disease based on weather API
async function predictDisease() {
    const city = 'Hyderabad'; // You can change dynamically if needed
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`; // Replace YOUR_API_KEY

    try {
        const response = await fetch(url);
        const data = await response.json();
        const humidity = data.main.humidity;
        const temperature = data.main.temp - 273.15; // Kelvin to Celsius

        let risk = '';
        if (humidity > 80 && temperature > 25) {
            risk = "⚠ High Risk of fungal diseases.";
        } else if (humidity < 40) {
            risk = "✅ Low Risk.";
        } else {
            risk = "⚠ Moderate Risk.";
        }
        document.getElementById('disease-result').innerText = risk;
    } catch (error) {
        document.getElementById('disease-result').innerText = "⚠ Weather fetch failed.";
    }
}

// Submit question to experts
function submitConsult() {
    const query = document.getElementById('consult-text').value;
    if (query.trim() !== "") {
        document.getElementById('consult-response').innerText = "✅ Question sent to experts! You'll get a reply soon.";
        document.getElementById('consult-text').value = "";
    } else {
        alert('Please enter a question.');
    }
}

// Voice input auto-start on page load
window.onload = function() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN'; // English (India)
    recognition.start();
    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        document.getElementById('voice-result').innerText = `You said: "${spokenText}"`;
    };
    recognition.onerror = function(event) {
        document.getElementById('voice-result').innerText = "⚠ Microphone error.";
    }
};

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