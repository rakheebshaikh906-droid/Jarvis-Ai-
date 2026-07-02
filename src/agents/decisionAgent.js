export function decideWebsite(text) {
    const command = text.toLowerCase();

    //  Courses, tutorials, videos
    if (
        command.includes("open youtube and ") ||
        command.includes("course") ||
        command.includes("tutorial") ||
        command.includes("playlist") ||
        command.includes("video") ||
        command.includes("watch") ||
        command.includes("learn")
    ) {
        return {
            website: "youtube",
            category: "learning",
            reason: "User wants learning content",
        };
    }

    //  Jobs
    if (
        command.includes("job") ||
        command.includes("jobs") ||
        command.includes("hiring") ||
        command.includes("internship")
    ) {
        return {
            website: "linkedin",
            category: "career",
            reason: "User is looking for jobs",
        };
    }

    //  Coding
    if (
        command.includes("leetcode") ||
        command.includes("problem") ||
        command.includes("coding")
    ) {
        return {
            website: "leetcode",
            category: "coding",
            reason: "Coding related query",
        };
    }

    //  GitHub
    if (
        command.includes("github") ||
        command.includes("repository") ||
        command.includes("repo") ||
        command.includes("project")
    ) {
        return {
            website: "github",
            category: "development",
            reason: "Developer project search",
        };
    }

    //  Shopping (Future)
    if (
        command.includes("buy") ||
        command.includes("price") ||
        command.includes("laptop") ||
        command.includes("phone")
    ) {
        return {
            website: "amazon",
            category: "shopping",
            reason: "Shopping query",
        };
    }

    //  Travel (Future)
    if (
        command.includes("flight") ||
        command.includes("hotel") ||
        command.includes("travel")
    ) {
        return {
            website: "makemytrip",
            category: "travel",
            reason: "Travel query",
        };
    }

    // Default
    return {
        website: "google",
        category: "general",
        reason: "General web search",
    };
}

