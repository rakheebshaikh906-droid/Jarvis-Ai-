export function handleJobCommand(text) {

    const command = text.toLowerCase().trim();

    const jobKeywords = [
        "job",
        "jobs",
        "hiring",
        "vacancy",
        "career",
        "developer",
        "engineer",
        "intern",
        "internship"
    ];

    const isJobSearch = jobKeywords.some(keyword =>
        command.includes(keyword)
    );

    if (!isJobSearch) return null;

    // Extract Location
    let location = "";

    const locationMatch = command.match(/in\s+([a-zA-Z\s]+)/);

    if (locationMatch) {
        location = locationMatch[1].trim();
    }

    // Extract Role
    let role = command;

    role = role
        .replace("find", "")
        .replace("search", "")
        .replace("jobs", "")
        .replace("job", "")
        .replace("internship", "")
        .replace("intern", "")
        .replace("hiring", "")
        .replace(/in\s+[a-zA-Z\s]+/, "")
        .trim();

    return {

        role,

        location,

        linkedInUrl:
            `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`,

        naukriUrl:
            `https://www.naukri.com/${encodeURIComponent(role)}-jobs-in-${encodeURIComponent(location)}`,

        indeedUrl:
            `https://in.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}`,

        success: true
    };

}

console.log(
    handleJobCommand("Find React Developer jobs in Pune")
);

console.log(
    handleJobCommand("Java Backend jobs in Bangalore")
);

console.log(
    handleJobCommand("Frontend internship in Hyderabad")
);