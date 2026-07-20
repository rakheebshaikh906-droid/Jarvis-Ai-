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

    //gallery
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

    //camera
    if (
        command.includes("camera") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_camera",
            message: "Opening Camera on your phone"
        };
    }

    // Instagram
    if (
        command.includes("instagram") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_instagram",
            message: "Opening Instagram on your phone"
        };
    }

    // WhatsApp
    if (
        command.includes("whatsapp") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_whatsapp",
            message: "Opening WhatsApp on your phone"
        };
    }

    return null;
}
