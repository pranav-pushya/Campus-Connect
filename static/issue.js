//dummy issue data
const issues = [
    {
        id: 1,
        title: "Power Sockets not working",
        description:"Many power sockets of Room 509 are not working.Please inspect and repair as soon as possible.",
        category: "Classroom",
        status: "Open",
        createdBy: "Student",
        createdAt: "17 October 2026"
    },
    {
        id: 2,
        title: "Water Cooler Maintenance",
        description:"Water cooler int Block T is not working properly and needs to be checked out and repaired.",
        category: "Campus",
        status: "In Progress",
        createdBy: "Student",
        createdAt: "10 October 2026"
    },
    {
        id: 3,
        title: "Lost ID Card",
        description:"A university ID card was found near the cafeteria.",
        category: "Lost&Found",
        status: "Open",
        createdBy: "Student",
        createdAt: "5 October 2026"
    },
    {
        id: 4,
        title: "Wi-Fi not connecting",
        description:"Campus Wi-Fi is not connecting on multiple devices and the connection frequently disconnects.",
        category: "Digital IT Services",
        status: "In Progress",
        createdBy: "Student",
        createdAt: "5 October 2026"
    },
    {
        id: 5,
        title: "Broken benches in classroom",
        description:"Benches in Room 501 are broken, benches need repair as soon as possible.",
        category: "Classroom",
        status: "Resolved",
        createdBy: "Faculty",
        createdAt: "4 October 2026"
    },
    {
        id: 6,
        title: "Washroom maintenance",
        description:"Washrooms need proper maintenance and cleaning to maintain hygine.",
        category: "Campus",
        status: "Resolved",
        createdBy: "Student",
        createdAt: "3 October 2026"
    },
    {
        id: 7,
        title: "Wallet found",
        description:"A black wallet was found near the sports complex.",
        category: "Lost&Found",
        status: "Open",
        createdBy: "Student",
        createdAt: "3 October 2026"
    },
    {
        id: 8,
        title: "Student portal login issue",
        description:"Unable to log into the student portal.",
        category: "Digital IT Services",
        status: "Open",
        createdBy: "Student",
        createdAt: "2 October 2026"
    },
    {
        id: 9,
        title: "Increase the number of notice boards",
        description:"Number of notice boards should be increased in frequently used areas to increase awareness amongst students in the campus.",
        category: "General",
        status: "In Progress",
        createdBy: "Student",
        createdAt: "1 October 2026"
    }
];
const urlParams = new URLSearchParams(window.location.search);
const issueId = Number(urlParams.get("id"));
const issue = issues.find(function(item) {
    return item.id === issueId;
});
//to get page elements
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const issueDetails = document.getElementById("issueDetails");
const issueTitle = document.getElementById("issueTitle");
const issueCategory = document.getElementById("issueCategory");
const issueStatus = document.getElementById("issueStatus");
const issueDescription = document.getElementById("issueDescription");
const createdBy = document.getElementById("createdBy");
const createdAt = document.getElementById("createdAt");
function updateStatusStyle(status) {
    issueStatus.classList.remove("status-open","status-progress","status-resolved");
    if (status === "Open") {
        issueStatus.classList.add("status-open");
    }
    else if (status === "In Progress") {
        issueStatus.classList.add("status-progress");
    }
    else if (status === "Resolved") {
        issueStatus.classList.add("status-resolved");
    }
}
if (issue) {
    issueTitle.textContent = issue.title;
    issueCategory.textContent = issue.category;
    issueStatus.textContent = issue.status;
    issueDescription.textContent = issue.description;
    createdBy.textContent = issue.createdBy;
    createdAt.textContent = issue.createdAt;
    updateStatusStyle(issue.status);
    loadingMessage.classList.add("hidden");
    issueDetails.classList.remove("hidden");
}
else {
    loadingMessage.classList.add("hidden");
    errorMessage.textContent = "Issue not found.";
    errorMessage.classList.remove("hidden");
}