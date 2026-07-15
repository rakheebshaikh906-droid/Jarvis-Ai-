const notes = [];

export function saveNote(note) {

    notes.push(note);

    return {
        success: true,
        message: " Note saved successfully."
    };
}

export function getNotes() {

    return {
        success: true,
        notes
    };
}

export function deleteNote(index) {

    if (index < 1 || index > notes.length) {

        return {
            success: false,
            message: " Invalid note number."
        };
    }

    notes.splice(index - 1, 1);

    return {
        success: true,
        message: " Note deleted."
    };
}

export function handleNotesCommand(text) {

    const command = text.trim();

    // Save Note
    if (
        command.toLowerCase().startsWith("take a note") ||
        command.toLowerCase().startsWith("save note")
    ) {

        const note = command
            .replace(/take a note/i, "")
            .replace(/save note/i, "")
            .trim();

        if (!note) {
            return {
                success: false,
                message: "Please enter a note."
            };
        }

        return saveNote(note);
    }

    // Show Notes
    if (
        command.toLowerCase() === "show my notes" ||
        command.toLowerCase() === "show notes"
    ) {

        return getNotes();
    }

    // Delete Note
    const deleteMatch = command.match(/delete note (\d+)/i);

    if (deleteMatch) {

        const index = Number(deleteMatch[1]);

        return deleteNote(index);
    }

    return null;
}

console.log(
    handleNotesCommand("Take a note Buy Milk")
);

console.log(
    handleNotesCommand("Take a note Complete Jarvis Project")
);

console.log(
    handleNotesCommand("Show my notes")
);

console.log(
    handleNotesCommand("Delete note 1")
);

console.log(
    handleNotesCommand("Show my notes")
);