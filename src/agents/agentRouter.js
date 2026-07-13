import { handleShoppingCommand } from "./shoppingAgent";
import { handleJobCommand } from "./jobAgent";
import { handleBrowserCommand } from "./browserAgent";

export function routeCommand(text) {

    const shoppingResult = handleShoppingCommand(text);

    if (shoppingResult) {
        return {
            agent: "shopping",
            data: shoppingResult
        };
    }

    const jobResult = handleJobCommand(text);

    if (jobResult) {
        return {
            agent: "job",
            data: jobResult
        };
    }

    const browserResult = handleBrowserCommand(text);

    if (browserResult) {
        return {
            agent: "browser",
            data: browserResult
        };
    }

    return null;
}