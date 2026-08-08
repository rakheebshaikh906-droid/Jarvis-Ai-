export function handlePhoneCommand(command) {

    if (!command) return null;

    command = command
        .toLowerCase()
        .trim()
        .replace(/[.,!?]+$/g, "");



    // CALL CONTACT

    if (command.startsWith("call ")) {

        const contactName = command
            .replace(/^call\s+/i, "")
            .trim();

        if (!contactName) {
            return null;
        }

        console.log(
            "CALL CONTACT DETECTED:",
            contactName
        );

        return {
            agent: "phone",
            action: "call_contact",
            contactName: contactName,
            message: `Opening dialer for ${contactName}`
        };
    }

    // SEND WHATSAPP MESSAGE

    let match = command.match(
        /^send\s+(?:whatsapp\s+)?message\s+to\s+(.+?)\s+saying\s+(.+)$/i
    );

    if (match) {

        console.log(
            "WHATSAPP MESSAGE DETECTED:",
            match[1],
            match[2]
        );

        console.log("MATCH1 =", match[1]);
        console.log("MATCH2 =", match[2]);

        return {
            agent: "phone",
            action: "send_whatsapp",
            contactName: match[1].trim(),
            message: match[2].trim()
        };
    }

    // WhatsApp Ashu hello

    match = command.match(
        /^whatsapp\s+(.+?)\s+(.+)$/i
    );

    if (match) {

        console.log(
            "WHATSAPP MESSAGE DETECTED:",
            match[1],
            match[2]
        );

        return {
            agent: "phone",
            action: "send_whatsapp",
            contactName: match[1].trim(),
            message: match[2].trim()
        };
    }

    //CHECK IF COMMAND IS FOR PHONE

    const isPhoneCommand =
        command.includes("on my phone") ||
        command.includes("in my phone") ||
        command.includes("on phone") ||
        command.includes("in phone");


    // Agar phone mention nahi hai,
    // Phone Agent kuch nahi karega.
    //
    // Example:
    // "Open YouTube" → return null
    // Browser Agent handle karega.

    if (!isPhoneCommand) {
        return null;
    }

    // YOUTUBE ON PHONE

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

    // 4. GOOGLE ON PHONE

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


    // GALLERY ON PHONE
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

    //camera on phone

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
    // 7. INSTAGRAM ON PHONE

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

    // 8. WHATSAPP ON PHONE

    if (
        (
            command.includes("whatsapp") ||
            command.includes("whats app") ||
            command.includes("what's app")
        ) &&
        command.includes("open")
    ) {

        return {
            agent: "phone",
            action: "open_whatsapp",
            message: "Opening WhatsApp on your phone"
        };
    }

    // snapchat on phone

    if (
        (
            command.includes("snapchat") ||
            command.includes("snap chat")
        ) &&
        command.includes("open")
    ) {

        return {
            agent: "phone",
            action: "open_snapchat",
            message: "Opening Snapchat on your phone"
        };
    }

    // facebook on phone

    if (
        command.includes("facebook") &&
        command.includes("open")
    ) {

        return {
            agent: "phone",
            action: "open_facebook",
            message: "Opening Facebook on your phone"
        };
    }

    // twitter on phone

    if (
        command.includes("twitter") &&
        command.includes("open")
    ) {

        return {
            agent: "phone",
            action: "open_twitter",
            message: "Opening Twitter on your phone"
        };
    }

    //amazon on phone
    if (
        command.includes("amazon") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_amazon",
            message: "Opening Amazon on your phone"
        };
    }
    //flipkart on phone
    if (
        command.includes("flipkart") &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_flipkart",
            message: "Opening Flipkart on your phone"
        };
    }
    //gmail on phone
    if (
        (
            command.includes("gmail") ||
            command.includes("email")
        ) &&
        command.includes("open")
    ) {
        return {
            agent: "phone",
            action: "open_gmail",
            message: "Opening Gmail on your phone"
        };
    }
    return null;
}
