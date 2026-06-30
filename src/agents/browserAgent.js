import { generateSearchUrl } from "./urlGenerator";

export function handleBrowserCommand(text) {
    const command = text.toLowerCase().trim();

    let website = "";
    let action = "search";
    let query = "";

    // youtube
    if (command.includes("youtube")) {
        website = "youtube";

        if (command.includes("play"))
            action = "play";
        else if (command.includes("watch"))
            action = "watch";

        query = command
            .replace("open youtube and search", "")
            .replace("search", "")
            .replace("play", "")
            .replace("watch", "")
            .replace("on youtube", "")
            .replace("youtube", "")
            .trim();
    }

    // ---------- Google ----------
    else if (command.includes("google")) {
        website = "google";

        query = command
            .replace("search", "")
            .replace("on google", "")
            .replace("google", "")
            .trim();
    }

    // ---------- GitHub ----------
    else if (command.includes("github")) {
        website = "github";

        query = command
            .replace("search", "")
            .replace("on github", "")
            .replace("github", "")
            .trim();
    }

    // ---------- LeetCode ----------
    else if (command.includes("leetcode")) {
        website = "leetcode";

        query = command
            .replace("search", "")
            .replace("on leetcode", "")
            .replace("leetcode", "")
            .trim();
    }

    // ---------- LinkedIn ----------
    else if (command.includes("linkedin")) {
        website = "linkedin";
        action = "find_jobs";

        query = command
            .replace("find", "")
            .replace("jobs", "")
            .replace("on linkedin", "")
            .replace("linkedin", "")
            .trim();
    }

    if (!website || !query)
        return null;

    const url = generateSearchUrl(website, query);

    return {
        website,
        action,
        query,
        url,
        success: true,
        message: `${action.replace("_", " ")} "${query}" on ${website}`
    };
}