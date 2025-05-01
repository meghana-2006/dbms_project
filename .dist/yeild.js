document.getElementById("prediction-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const cropType = document.getElementById("cropType").value;
    const soilType = document.getElementById("soilType").value;
    const rainfall = document.getElementById("rainfall").value;
    const temperature = document.getElementById("temperature").value;

    const requestData = {
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are an AI expert predicting crop yield based on user input." },
            { role: "user", content: `Predict yield for Crop: ${cropType}, Soil: ${soilType}, Rainfall: ${rainfall}mm, Temperature: ${temperature}°C.` }
        ]
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY"  // Replace this with your actual API key
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Full response from OpenAI:", data); // Debug log

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            document.getElementById("result").innerText = `Predicted Yield: ${data.choices[0].message.content.trim()} tons/hectare (AI-based)`;
        } else {
            document.getElementById("result").innerText = "Error: AI did not return a prediction.";
        }
    } catch (error) {
        console.error("Error fetching AI-based yield prediction:", error);
        document.getElementById("result").innerText = "Error fetching AI-based prediction. Check API key and network.";
    }
});