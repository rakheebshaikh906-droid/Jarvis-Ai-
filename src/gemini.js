import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/*export async function askGemini(prompt, history = []) {
    const recentHistory = history.slice(-6); // last 6 messages only

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        systemInstruction: `You are Jarvis, an intelligent desktop AI assistant created by Rakheeb Shaikh.

            Your personality:
            - Professional, friendly and helpful.
            - Answer naturally like a real AI assistant.
            - Never say you are Google Gemini.
            - Keep answers concise unless the user asks for details.
            - For programming questions, explain step by step.
            - Never make up facts.
            `,
        contents: [
            ...recentHistory.map(h => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.text }]
            })),
            { role: "user", parts: [{ text: prompt }] }
        ],
    });

    const answer =
        typeof response.text === "function"
            ? response.text()
            : response.text;

    return answer || "Sorry, I couldn't generate a response.";
} */
export async function askGemini(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `User: ${prompt}`,
        });

        console.log("RESPONSE:", response);

        return response.text;
    } catch (error) {
        console.error("GEMINI ERROR:", error);
        throw error;
    }
}

export async function askGeminiWithRetry(prompt, history = [], retries = 2) {
    try {
        return await askGemini(prompt, history);
    } catch (err) {

        const retryable =
            err.status === 429 ||
            err.status === 503 ||
            err.message?.includes("429") ||
            err.message?.includes("503") ||
            err.message?.includes("RESOURCE_EXHAUSTED");

        if (retryable && retries > 0) {

            console.log(`Retrying... (${retries} left)`);

            await new Promise(r =>
                setTimeout(r, (3 - retries) * 2000)
            );

            return askGeminiWithRetry(
                prompt,
                history,
                retries - 1
            );
        }

        throw err;
    }
}