export function handlePhoneCommand(text) {
    const command = text.toLowerCase().trim();

    // Phone command hai ya nahi
    const isPhoneCommand =
        command.includes("phone") ||
        command.includes("mobile");

    if (!isPhoneCommand) {
        return null;
    }

    // YouTube
    if (
        command.includes("youtube") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_youtube",
            message: "Opening YouTube on your phone"
        };
    }

    // Google
    if (
        command.includes("google") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_google",
            message: "Opening Google on your phone"
        };
    }

    // Gallery - baad me implement karenge
    if (
        command.includes("gallery") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_gallery",
            message: "Opening Gallery on your phone"
        };
    }

    return null;
}
