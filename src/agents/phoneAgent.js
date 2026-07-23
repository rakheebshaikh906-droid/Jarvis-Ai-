export function handlePhoneCommand(command) {

    if (!command) return null;

    command = command
        .toLowerCase()
        .trim();



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


    return null;
}