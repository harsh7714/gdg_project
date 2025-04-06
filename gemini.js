import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

const key = "AIzaSyAoQK9DOs7eyMjBIOL9hwUOsx2RL7bk9-k"; // Replace with your actual Google GenAI API key
const ai = new GoogleGenAI({ apiKey: key });

async function processFile(file, prompt) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                const fileContents = event.target.result;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash-001',
                    contents: `${fileContents}\n\n${prompt}`
                });

                const cleanedText = response.text.replace(/```json|```/g, "").trim();
                const jsonobj = JSON.parse(cleanedText);

                localStorage.setItem("medicalData", JSON.stringify(jsonobj));
                resolve(jsonobj);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function () {
            reject(new Error("Error reading the file."));
        };

        reader.readAsText(file);
    });
}

document.getElementById("create").addEventListener("click", async () => {
    try {
        const fileInput = document.getElementById("userdata");
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file to process.");
            return;
        }

        const prompt = "Extract and return the following details in JSON format: name, age, medical conditions, prescription, and the date. Only include these fields.";

        const data = await processFile(file, prompt);

        document.getElementById("name").textContent = data.name || "Unknown";
        document.getElementById("age").textContent = data.age || "Unknown";
        document.getElementById("condition").textContent = data.medicalconditions || "Unknown";
        document.getElementById("date").textContent = data.date || "Unknown";
        document.getElementById("prescription").textContent = data.prescription || "Unknown";

        console.log("Retrieved Data:", data);
    } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while processing the file.");
    }
});