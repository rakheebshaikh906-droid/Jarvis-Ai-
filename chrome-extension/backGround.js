chrome.commands.onCommand.addListener((command) => {
    if (command === "start-browser-mic") {
        console.log("JARVIS → BROWSER MIC SHORTCUT");

        chrome.tabs.query(
            { url: "http://localhost:5173/*" },
            (tabs) => {

                if (tabs.length === 0) {
                    console.log("Jarvis localhost tab not found");
                    return;
                }

                const tab = tabs[0];

                chrome.tabs.sendMessage(
                    tab.id,
                    {
                        type: "START_BROWSER_MIC"
                    }
                );
            }
        );
    }
});