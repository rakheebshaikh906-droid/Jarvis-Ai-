const memory = {};

export function handleMemoryCommand(text) {

    const command = text.trim();

    // Remember
    if (command.toLowerCase().startsWith("remember")) {

        const match = command.match(/remember\s+my\s+(.+?)\s+is\s+(.+)/i);

        if (!match) return null;

        const key = match[1].trim();
        const value = match[2].trim();

        return remember(key, value);
    }

    // Recall
    if (
        command.toLowerCase().startsWith("what is my") ||
        command.toLowerCase().startsWith("what's my")
    ) {

        const key = command
            .replace(/what is my/i, "")
            .replace(/what's my/i, "")
            .replace("?", "")
            .trim();

        return recall(key);
    }

    return null;
}

export function remember(key, value) {
    memory[key] = value;

    return {
        success: true,
        message: `I'll remember that your ${key} is ${value}.`
    };
}

export function recall(key) {
    if (!memory[key]) {
        return {
            success: false,
            message: `I don't know your ${key} yet.`
        };
    }

    return {
        success: true,
        value: memory[key],
        message: `Your ${key} is ${memory[key]}.`
    };
}

export function getMemory() {
    return memory;
}

