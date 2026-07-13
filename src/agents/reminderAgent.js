export function handleReminderCommand(text) {

    const command = text.toLowerCase().trim();

    if (!command.startsWith("remind me to")) {
        return null;
    }

    const match = command.match(
        /remind me to (.+) in (\d+)\s*(minute|minutes|hour|hours)/i
    );

    if (!match) {
        return {
            success: false,
            message: "Please use: Remind me to <task> in <time> minutes/hours."
        };
    }

    const task = match[1].trim();
    const time = Number(match[2]);
    const unit = match[3].toLowerCase();

    return {
        success: true,
        task,
        time,
        unit
    };
}

export function scheduleReminder(reminder, callback) {

    let delay = reminder.time * 60 * 1000;

    if (reminder.unit === "hour" || reminder.unit === "hours") {
        delay = reminder.time * 60 * 60 * 1000;
    }

    setTimeout(() => {

        callback({
            success: true,
            task: reminder.task,
            message: ` Reminder: ${reminder.task}`
        });

    }, delay);

}
