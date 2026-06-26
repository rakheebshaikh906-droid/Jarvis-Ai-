import { askGroq } from "./groq";
const API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

export async function searchWeb(query) {
    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: API_KEY,
                query,
                search_depth: "advanced",
                max_results: 5,
                include_answer: "advanced"
            }),
        });

        const data = await response.json();

        console.log("TAVILY:", data);

        console.log("FIRST RESULT :", data.results[0]);

        return data;

    } catch (error) {

        console.error("Error searching web:", error);
        throw error;
    }
}

export async function searchAndSummarize(query) {

    const search = await searchWeb(query);

    const context = search.results
        .map(r =>
            `Title: ${r.title}\nContent: ${r.content}`
        )
        .join("\n\n");

    return await askGroq(
        `
        You are Jarvis AI.
        Answer the user's question ONLY using the search results below.
        If the search results do not contain the answer, clearly say that the information was not found.
        Summarize the information in a clear and concise way.
        Do not invent facts.
        
        Question:
        ${query}

        Search Results:

        ${context}
    `
    );
}