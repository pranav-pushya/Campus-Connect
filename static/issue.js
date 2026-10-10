//dummy issue data
const issues = [
    {
        id: 1,
        title: "Power Sockets not working",
        description:"Many power sockets of Room 509 are not working.Please inspect and repair as soon as possible.",
        category: "Classroom",
        status: "Open",
        created_by_name: "Student",
        created_at: "2026-10-04T10:00:00Z"
    },
    {
        id: 2,
        title: "Water Cooler Maintenance",
        description:"Water cooler int Block T is not working properly and needs to be checked out and repaired.",
        category: "Campus",
        status: "In Progress",
        created_by_name: "Student",
        created_at: "2026-10-07T10:00:00Z"
    },
    {
        id: 3,
        title: "Lost ID Card",
        description:"A university ID card was found near the cafeteria.",
        category: "Lost & Found",
        status: "Open",
        created_by_name: "Student",
        created_at: "2026-10-02T10:00:00Z"
    },
    {
        id: 4,
        title: "Wi-Fi not connecting",
        description:"Campus Wi-Fi is not connecting on multiple devices and the connection frequently disconnects.",
        category: "Digital IT Services",
        status: "In Progress",
        created_by_name: "Student",
        created_at: "2026-10-07T10:00:00Z"
    },
    {
        id: 5,
        title: "Broken benches in classroom",
        description:"Benches in Room 501 are broken, benches need repair as soon as possible.",
        category: "Classroom",
        status: "Resolved",
        created_by_name: "Faculty",
        created_at: "2026-10-04T10:00:00Z"
    },
    {
        id: 6,
        title: "Washroom maintenance",
        description:"Washrooms need proper maintenance and cleaning to maintain hygine.",
        category: "Campus",
        status: "Resolved",
        created_by_name: "Student",
        created_at: "2026-10-03T10:00:00Z"
    },
    {
        id: 7,
        title: "Wallet found",
        description:"A black wallet was found near the sports complex.",
        category: "Lost & Found",
        status: "Open",
        created_by_name: "Student",
        created_at: "2026-10-05T10:00:00Z"
    },
    {
        id: 8,
        title: "Student portal login issue",
        description:"Unable to log into the student portal.",
        category: "Digital IT Services",
        status: "Open",
        created_by_name: "Student",
        created_at: "2026-10-06T10:00:00Z"
    },
    {
        id: 9,
        title: "Increase the number of notice boards",
        description:"Number of notice boards should be increased in frequently used areas to increase awareness amongst students in the campus.",
        category: "General",
        status: "In Progress",
        created_by_name: "Student",
        created_at: "2026-10-04T10:00:00Z"
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
const statusSelect = document.getElementById("status");
const statusForm = document.getElementById("statusForm");
const statusError = document.getElementById("statusError");
const statusSuccess = document.getElementById("statusSuccess");
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
    createdBy.textContent = issue.created_by_name;
    createdAt.textContent = formatDate(issue.created_at);
    statusSelect.value = issue.status;
    updateStatusStyle(issue.status);
    loadingMessage.classList.add("hidden");
    issueDetails.classList.remove("hidden");
}
else {
    loadingMessage.classList.add("hidden");
    errorMessage.textContent = "Issue not found.";
    errorMessage.classList.remove("hidden");
}

if (issue && statusForm) {
    statusForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newStatus = statusSelect.value;

        issue.status = newStatus;
        issueStatus.textContent = newStatus;
        updateStatusStyle(newStatus);

        statusError.classList.add("hidden");
        statusSuccess.textContent = "Status updated successfully.";
        statusSuccess.classList.remove("hidden");
    });
}
