export async function getWikipediaData(query) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Wikipedia page not found.");
        }

        const data = await response.json();

        return {
            title: data.title,
            summary: data.extract,
            image: data.thumbnail?.source || null,
            wikipedia: data.content_urls?.desktop?.page || null,
        };

    } catch (error) {
        console.error("Wikipedia Error:", error);

        return null;
    }
}