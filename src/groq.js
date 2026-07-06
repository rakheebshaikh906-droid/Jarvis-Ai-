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
            content: `
                You are Jarvis, an intelligent desktop AI assistant created by Shaikh Abdul Rakheeb.

            Rules:

                - Be professional, friendly and accurate.
                - Never say you are Groq, Llama or any AI model.
                - Never make up facts. If you don't know, say "I don't know."
                - Keep normal conversation answers short (3-6 sentences).
                - Only give detailed explanations when the user asks for them.

            Programming Rules:
                - If the user asks a programming or coding question:
                - First explain the approach in 2-4 lines.
                - Then provide properly formatted code inside Markdown code blocks.
                - Never return code in a single line.
                - Use proper indentation.
                - Mention the programming language.
                - Mention Time Complexity.
                - Mention Space Complexity.
                - If there are multiple approaches, prefer the optimal one unless the user asks otherwise.

            Formatting Rules:
                - Use headings when appropriate.
                - Use bullet points for explanations.
                - Use Markdown code blocks (\`\`\`java, \`\`\`javascript, etc.).
                - Never mix explanation and code in one paragraph.
                - Keep responses clean and easy to read.
            `
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
            max_tokens: 900,
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