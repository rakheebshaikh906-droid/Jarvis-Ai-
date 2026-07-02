import { askGroq } from "../groq";

export async function getShoppingRecommendation(category, budget) {

    const prompt = `
You are an expert shopping assistant.

A user wants to buy a ${category} under ₹${budget}.

Recommend the best 3 products.

Return ONLY valid JSON.
Do not wrap the JSON inside markdown code fences.
Also return

amazonQuery

flipkartQuery

youtubeQuery

{"products":[
    {
      "name":"",
      "price":"",
      "pros":[],
      "cons":[],
      "reason":"",
      "amazonQuery":"",
      "flipkartQuery":"",
      "youtubeQuery":""
    }
  ]
}
`;

    const response = await askGroq(prompt);

    try {

        const cleanResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanResponse);

    } catch (error) {

        console.error("Shopping AI Parse Error");

        console.log(response);

        return null;

    }
}

const result = await getShoppingRecommendation("laptop", "50000");

console.log(result);