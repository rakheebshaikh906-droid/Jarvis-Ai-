import { decideWebsite } from "./decisionAgent";
import { generateSearchUrl } from "./urlGenerator";

export function handleBrowserCommand(text) {

    const decision = decideWebsite(text);

    const website = decision.website;

    let action = "search";

    if (text.toLowerCase().includes("play"))
        action = "play";

    else if (text.toLowerCase().includes("watch"))
        action = "watch";

    else if (text.toLowerCase().includes("learn"))
        action = "learn";

    else if (text.toLowerCase().includes("find"))
        action = "find";

    const query = text
        .replace(/open/gi, "")
        .replace(/search/gi, "")
        .replace(/find/gi, "")
        .replace(/play/gi, "")
        .replace(/watch/gi, "")
        .replace(/learn/gi, "")
        .replace(/youtube/gi, "")
        .replace(/google/gi, "")
        .replace(/github/gi, "")
        .replace(/leetcode/gi, "")
        .replace(/linkedin/gi, "")
        .replace(/on/gi, "")
        .trim();

    if (!query)
        return null;

    const url = generateSearchUrl(website, query);

    return {
        website,
        action,
        query,
        url,
        success: true,
        category: decision.category,
        reason: decision.reason,
        message: `${action} "${query}" on ${website}`
    };
}