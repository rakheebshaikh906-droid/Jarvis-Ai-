import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function askGroq(prompt, history = []) {
    const recentHistory = history.slice(-6);

    const messages = [
        {
            role: "system",
            content: `You are Jarvis, an intelligent desktop AI assistant created by shaikh abdul rakheeb.

            Rules:
            - Default to answers of 3-6 sentences.
            - Give detailed explanations ONLY if the user explicitly asks for details.
            - For coding questions, explain briefly first, then provide code if needed.
            - Avoid unnecessary long paragraphs.
            - Keep responses concise and practical.
            - Never make up facts. If you don't know, say "I don't know" or "I am not sure"
            - give small answer and avoid long paragraphs. If the user asks for more details, then provide a detailed answer.
            `,
        },

        ...recentHistory.map((msg) => ({
            role: msg.role,
            content: msg.text,
        })),

        {
            role: "user",
            content: prompt,
        },
    ];

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.3,
            max_tokens: 350,
        });

        return (
            completion.choices[0]?.message?.content ||
            "Sorry, I couldn't generate a response."
        );
    } catch (error) {
        console.error("GROQ ERROR:", error);
        throw error;
    }
}