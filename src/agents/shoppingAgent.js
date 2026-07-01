export function handleShoppingCommand(text) {

    const command = text.toLowerCase();

    // Shopping keywords
    const shoppingWords = [
        "buy",
        "best",
        "laptop",
        "phone",
        "mobile",
        "keyboard",
        "mouse",
        "monitor",
        "headphone",
        "earbuds",
        "camera"
    ];

    const isShopping = shoppingWords.some(word =>
        command.includes(word)
    );

    if (!isShopping) return null;

    // Extract Budget
    const budgetMatch = command.match(/\d+/);

    const budget = budgetMatch ? budgetMatch[0] : null;

    // Extract Category
    let category = command;

    category = category
        .replace("best", "")
        .replace("buy", "")
        .replace("under", "")
        .replace(/\d+/g, "")
        .trim();

    return {

        category,

        budget,

        amazonUrl:
            `https://www.amazon.in/s?k=${encodeURIComponent(
                `${category} under ${budget || ""}`
            )}`,

        flipkartUrl:
            `https://www.flipkart.com/search?q=${encodeURIComponent(
                `${category} under ${budget || ""}`
            )}`,
        blinKitUrl:
            `https://blinkit.com/search?q=${encodeURIComponent(
                `${category} under ${budget || ""}`
            )}`,

        success: true
    };
}