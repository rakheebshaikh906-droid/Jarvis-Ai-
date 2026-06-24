import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function askGemini(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
      You are Jarvis AI.
      Keep answers concise.
      Give concise answers.

      User: ${prompt}
    `,
    });

    return response.text;
}