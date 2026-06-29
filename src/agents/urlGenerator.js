export function generateSearchUrl(website, query) {
    const encodedQuery = encodeURIComponent(query);

    switch (website.toLowerCase()) {
        case "google":
            return `https://www.google.com/search?q=${encodedQuery}`;

        case "youtube":
            return `https://www.youtube.com/results?search_query=${encodedQuery}`;

        case "github":
            return `https://github.com/search?q=${encodedQuery}`;

        case "leetcode":
            return `https://leetcode.com/problemset/?search=${encodedQuery}`;

        case "linkedin":
            return `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}`;

        default:
            return null;
    }
}