window.addEventListener("message", (event) => {

    if (
        event.source !== window ||
        event.data?.type !== "START_BROWSER_MIC"
    ) {
        return;
    }

    console.log("JARVIS EXTENSION → BROWSER MIC");

    window.postMessage(
        {
            source: "jarvis-extension",
            type: "START_BROWSER_MIC"
        },
        "*"
    );
});