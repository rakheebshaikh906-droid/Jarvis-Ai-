import { askGroq } from "../groq";

export async function getJobRecommendation(role, location) {

    const prompt = `
You are an expert career advisor.

A user is looking for a ${role} job in ${location}.

Return ONLY valid JSON.

Format:

{
  "role":"",
  "location":"",
  "salary":"",
  "skills":[],
  "interviewTopics":[],
  "tips":[]
}

Rules:

- Return JSON only.
- Do not use markdown.
- Do not wrap the response inside \`\`\`.
- Keep skills and interview topics short.
- Salary should be approximate.
`;

    const response = await askGroq(prompt);

    try {

        const cleanResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanResponse);

    } catch (error) {

        console.error("Job AI Parse Error", error);
        console.log(response);

        return null;
    }
}