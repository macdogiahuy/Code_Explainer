// Test script to verify API key
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyAQgd-f6ZBNHyqj-z1ggjbVabf4nYWBh3U";

async function testAPIKey() {
    try {
        console.log("Testing API key...");
        const genAI = new GoogleGenAI({ apiKey });
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent("Hello, can you respond with 'API key works!'?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("API key test failed:", error.message);
    }
}

testAPIKey();