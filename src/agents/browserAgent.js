import { decideWebsite } from "./decisionAgent";
import { generateSearchUrl } from "./urlGenerator";

export function handleBrowserCommand(text) {
    const command = text.toLowerCase().trim();

    const browserKeywords = [
        "search",
        "open",
        "find",
        "play",
        "watch",
        "learn",
        "google",
        "youtube",
        "github",
        "leetcode",
        "linkedin"
    ];

    const isBrowserCommand = browserKeywords.some(keyword =>
        command.includes(keyword)
    );

    if (!isBrowserCommand) {
        return null;
    }

    const decision = decideWebsite(text);
    const website = decision.website;

    let action = "search";

    if (command.includes("play")) {
        action = "play";
    } else if (command.includes("watch")) {
        action = "watch";
    } else if (command.includes("learn")) {
        action = "learn";
    } else if (command.includes("find")) {
        action = "find";
    }

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
        .replace(/\band\b/gi, "")
        .replace(/\bon\b/gi, "")
        .trim();

    if (!query) {
        return null;
    }

    const url = generateSearchUrl(website, query);

    if (!url) {
        return null;
    }

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