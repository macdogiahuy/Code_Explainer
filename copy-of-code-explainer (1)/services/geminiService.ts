import { GoogleGenAI, Type } from "@google/genai";
import { Language, Explanation } from '../types';

// Temporarily hardcode API key for testing
const apiKey = process.env.API_KEY || "AIzaSyCdc7r5xWu4h67Jum0gL3oYjWgjTRbFUKw";
console.log('Using API key:', apiKey ? 'SET' : 'NOT SET');

// Try direct fetch approach as fallback
async function callGeminiDirectly(prompt: string): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.2,
        }
    };

    console.log('Making direct API call to:', url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallExplanation: {
            type: Type.STRING,
            description: "A concise, high-level summary of the code's purpose that directly addresses the user's request."
        },
        detailedBreakdown: {
            type: Type.STRING,
            description: "A more in-depth explanation of the logic, algorithms, and key components, relevant to the user's request."
        },
        lineByLineExplanation: {
            type: Type.STRING,
            description: "A step-by-step explanation for each significant line or block of code, formatted as HTML with <ul> and <li> tags. Each <li> that corresponds to a line should have a 'data-line' attribute with the line number(s)."
        },
    },
    required: ['overallExplanation', 'detailedBreakdown', 'lineByLineExplanation'],
};


export async function getCodeExplanation(prompt: string, code: string, language: Language): Promise<Explanation> {
    const userRequest = prompt.trim() || 'Explain this code in detail.'; // Fallback to default behavior

    const fullPrompt = `
You are an expert code explainer. Your task is to analyze the provided ${language} code based on the user's request and provide three distinct explanations.

**User Request:**
${userRequest}

**Code to analyze:**
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

**Instructions:**
1.  **Overall Explanation:** Write a concise, high-level summary that directly addresses the user's request regarding the code.
2.  **Detailed Breakdown:** Provide a more in-depth explanation of the code's logic, algorithms, or structure relevant to the user's request.
3.  **Line-by-Line Explanation:** Create a step-by-step breakdown. For each significant line or logical block, provide a clear explanation. Format this as an HTML unordered list (\`<ul>\`), with each point in a list item (\`<li>\`). Crucially, for each list item that refers to a specific line number or range, add a "data-line" attribute containing the number or range (e.g., \`data-line="5"\` or \`data-line="10-12"\`). Use \`<strong>\` tags for key terms but not for line numbers themselves.

Return the response as a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting (like \`\`\`json) around the JSON object.
`;

    try {
        console.log('Trying direct API call first...');
        
        // Try direct API call first
        const directResponse = await callGeminiDirectly(fullPrompt);
        console.log('Direct API response:', directResponse);
        
        if (directResponse.candidates && directResponse.candidates[0]) {
            const responseText = directResponse.candidates[0].content.parts[0].text;
            console.log('Response text from direct call:', responseText);
            
            // Try to parse JSON, fallback to simple explanation if it fails
            try {
                const parsedJson = JSON.parse(responseText);
                return parsedJson as Explanation;
            } catch (parseError) {
                console.log('JSON parse failed, creating fallback explanation');
                return {
                    overallExplanation: responseText,
                    detailedBreakdown: "Generated explanation from Gemini API",
                    lineByLineExplanation: "<ul><li>Direct API response received successfully</li></ul>"
                };
            }
        }
        
        throw new Error('No valid response from direct API call');

    } catch (error) {
        console.error("Direct API call failed, trying library approach:", error);
        
        // Fallback to library approach
        try {
            console.log('Making API request using library...');
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: fullPrompt,
                config: {
                    temperature: 0.2,
                },
            });

            console.log('Library API response received:', response);
            const jsonString = response.text.trim();
            console.log('Response text:', jsonString);
            
            try {
                const parsedJson = JSON.parse(jsonString);
                return parsedJson as Explanation;
            } catch (parseError) {
                console.log('JSON parse failed, creating fallback explanation');
                return {
                    overallExplanation: jsonString,
                    detailedBreakdown: "Unable to parse detailed breakdown from response.",
                    lineByLineExplanation: "<ul><li>Response parsing failed</li></ul>"
                };
            }
        } catch (libraryError) {
            console.error("Library approach also failed:", libraryError);
            throw new Error("Failed to get explanation from Gemini API: " + libraryError.message);
        }
    }
}