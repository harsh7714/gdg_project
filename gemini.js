let key = "AIzaSyBWDwRO4LoXdDc2IZy1LGobkYIPgEqLOhk"

const userdata = document.getElementById("userdata");
const button = document.getElementById("create");

// Variable to store selected file
let selectedFile;

// Add a change event listener to the file input
userdata.addEventListener("change", function (event) {
  // Access the files after user selects a file
  selectedFile = event.target.files[0];  // Get the first file selected
});

// Add the click event listener to the button
button.addEventListener("click", () => {
  // Check if a file was selected
  if (selectedFile) {
    console.log("Selected file name: " + selectedFile.name);
  } else {
    console.log("No file selected.");
  }
});

// gemini
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "../@google/generative-ai";

// Replace with the appropriate way to pass API key securely.
const apikey = key;  // NEVER expose your real API key in frontend code.

const genAI = new GoogleGenerativeAI(apikey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-preview-03-25",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage("hello");

  // Process the response and handle file data.
  const candidates = result.response.candidates;

  for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      
      if (part.inlineData) {
        try {
          // Create a Blob object for the inline data (binary content)
          const mimeType = part.inlineData.mimeType;
          const blob = new Blob([new Uint8Array(part.inlineData.data)], { type: mimeType });
          
          // Generate a URL for the Blob and create a download link
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `output_${candidate_index}_${part_index}.${mime.extension(mimeType)}`;
          
          // Trigger the download
          downloadLink.click();
          console.log(`Output written to: ${downloadLink.download}`);
        } catch (err) {
          console.error("Error processing inline data:", err);
        }
      }
    }
  }

  console.log(result.response.text());
}

run();
