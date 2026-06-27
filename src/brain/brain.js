export function detectIntent(text) {

    const cmd = text.toLowerCase();

    // Weather

    if (cmd.includes("weather")) {

        return "weather";

    }

    // Memory

    if (
        cmd.startsWith("remember that") ||
        cmd.startsWith("what is my") ||
        cmd.startsWith("my name is")
    ) {

        return "memory";

    }

    // Live Search

    const searchWords = [

        "latest",

        "current",

        "today",

        "news",

        "price",

        "winner",

        "won",

        "score",

        "bitcoin",

        "stock",

        "president",

        "prime minister",

        "2025",

        "2026"
    ];

    if (

        searchWords.some(word => cmd.includes(word))

    ) {

        return "search";

    }

    // Desktop Apps

    const apps = [

        "calculator",

        "notepad",

        "chrome",

        "spotify",

        "vscode",

        "explorer"

    ];

    if (

        apps.some(app => cmd.includes(app))

    ) {

        return "desktop";

    }

    // Wikipedia Entity

    // Wikipedia / Rich Response

    const wikiPatterns = [

        "who is",

        "what is",

        "tell me about",

        "information about",

        "about",

        "show me",

        "explain"

    ];

    if (

        wikiPatterns.some(pattern => cmd.startsWith(pattern))

    ) {

        return "wiki";

    }

    // Short entity names

    if (

        cmd.split(" ").length <= 3

    ) {

        return "wiki";

    }

    // Default

    return "ai";

}