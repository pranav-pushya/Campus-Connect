
// Get issue ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get("id");

// Get page elements
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

let currentIssue = null;

// Update status badge styling
function updateStatusStyle(status) {
    issueStatus.classList.remove(
        "status-open",
        "status-progress",
        "status-resolved"
    );

    if (status === "Open") {
        issueStatus.classList.add("status-open");
    } else if (status === "In Progress") {
        issueStatus.classList.add("status-progress");
    } else if (status === "Resolved") {
        issueStatus.classList.add("status-resolved");
    }
}

// Display issue details
function displayIssue(issue) {
    currentIssue = issue;

    issueTitle.textContent = issue.title;
    issueCategory.textContent = issue.category;
    issueStatus.textContent = issue.status;
    issueDescription.textContent = issue.description;
    createdBy.textContent = issue.created_by_name || "Student";
    createdAt.textContent = issue.created_at
        ? formatDate(issue.created_at)
        : "Date unavailable";

    statusSelect.value = issue.status;
    updateStatusStyle(issue.status);

    loadingMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");
    issueDetails.classList.remove("hidden");
}

// Fetch issue from backend
async function loadIssue() {
    if (!issueId || !Number.isInteger(Number(issueId))) {
        loadingMessage.classList.add("hidden");
        errorMessage.textContent = "Invalid issue ID.";
        errorMessage.classList.remove("hidden");
        return;
    }

    try {
        const response = await apiFetch("/api/issues/" + issueId);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Could not load issue."
            );
        }

        displayIssue(data);
    } catch (error) {
        if (error.message === "Not authenticated") {
            return;
        }

        console.error("Error loading issue:", error);
        loadingMessage.classList.add("hidden");
        errorMessage.textContent =
            error.message || "Could not load issue. Please try again.";
        errorMessage.classList.remove("hidden");
    }
}

// Update issue status through backend
if (statusForm) {
    statusForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!currentIssue) return;

        statusError.classList.add("hidden");
        statusSuccess.classList.add("hidden");

        try {
            const response = await apiFetch(
                "/api/issues/" + issueId + "/status",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status: statusSelect.value
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Could not update status."
                );
            }

            currentIssue.status = data.status || statusSelect.value;
            issueStatus.textContent = currentIssue.status;
            statusSelect.value = currentIssue.status;
            updateStatusStyle(currentIssue.status);

            statusSuccess.textContent = "Status updated successfully.";
            statusSuccess.classList.remove("hidden");
        } catch (error) {
            if (error.message === "Not authenticated") return;

            statusError.textContent =
                error.message || "Could not update status.";
            statusError.classList.remove("hidden");
        }
    });
}

// Load the requested issue
requireAuth();
loadIssue();
