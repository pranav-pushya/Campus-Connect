// Store issues fetched from the backend
let allIssues = [];
// Check authentication before loading dashboard data
requireAuth();
//to get the dashboard elements
const categories =document.getElementById("categories");
const statusFilter = document.getElementById("statusFilter");
const openCount =document.getElementById("openCount");
const inProgressCount =document.getElementById("inProgressCount");
const resolvedCount =document.getElementById("resolvedCount");
const mainBox =document.querySelector(".box");
const filters =document.querySelector(".filters");
//Creating issue container
const issuesContainer =document.createElement("section");
issuesContainer.className ="issues-container";
mainBox.appendChild(issuesContainer);


function getStatusClass(status) {
    if (status === "Open") {
        return "status-open";
    }
    if (status === "In Progress") {
        return "status-progress";
    }
    if (status === "Resolved") {
        return "status-resolved";
    }
    return "";
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
        node.className = className;
    }
    if (text !== undefined) {
        node.textContent = text;
    }
    return node;
}


function updateStatistics(data) {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
   data.forEach(function(issue) {
            if (issue.status === "Open") {
            open++;
        }
        else if (issue.status === "In Progress") {
            inProgress++;
        }
        else if (issue.status === "Resolved") {
            resolved++;
        }
    });
   openCount.textContent = open;
    inProgressCount.textContent = inProgress;
    resolvedCount.textContent = resolved;
}

function renderIssues(data) {
    issuesContainer.textContent = "";
    if (data.length === 0) {
        issuesContainer.appendChild(
            el("p", "message", "No issues found.")
        );
        return;
    }

    data.forEach(function(issue) {
        const card = el("div", "issue-card");
        const header = el("div", "issue-card-header");
        const left = el("div");

        left.append(
            el("h3", "", issue.title),
            el("span", "category-badge", issue.category)
        );

        header.append(
            left,
            el(
                "span",
                "status-badge " + getStatusClass(issue.status),
                issue.status
            )
        );
        const footer = el("div", "issue-card-footer");

        const date = el(
            "span",
            "",
            formatDate(issue.created_at)
        );
        const link = el(
            "a",
            "button primary-button",
            "View Details"
        );
        link.href = "issue.html?id=" + encodeURIComponent(issue.id);

        footer.append(date, link);

        card.append(
            header,
            el(
                "p",
                "issue-card-description",
                issue.description
            ),
            footer
        );
        issuesContainer.appendChild(card);
    });
}


function filterIssues() {
    const selectedCategory = categories.value;
    const selectedStatus = statusFilter.value;

    const filteredIssues = allIssues.filter(function(issue) {
        const categoryMatches =
            selectedCategory === "" ||
            issue.category === selectedCategory;

        const statusMatches =
            selectedStatus === "" ||
            issue.status === selectedStatus;

        return categoryMatches && statusMatches;
    });

    renderIssues(filteredIssues);
}

categories.addEventListener(
    "change",
    filterIssues
);
statusFilter.addEventListener(
    "change",
    filterIssues
);

async function loadIssues() {
    issuesContainer.textContent = "Loading issues...";

    try {
        // Fetch the actual issues from the backend
        const issuesResponse = await apiFetch("/api/issues");

        if (!issuesResponse.ok) {
            throw new Error("Could not load issues");
        }

        allIssues = await issuesResponse.json();

        // Fetch actual dashboard statistics from M4's API
        const statsResponse = await apiFetch("/api/stats");

        if (!statsResponse.ok) {
            throw new Error("Could not load statistics");
        }

        const stats = await statsResponse.json();

        openCount.textContent = stats.open;
        inProgressCount.textContent = stats.in_progress;
        resolvedCount.textContent = stats.resolved;

        // Apply the selected category and status filters
        filterIssues();

    } catch (error) {
        if (error.message === "Not authenticated") {
            return;
        }

        console.error("Dashboard loading error:", error);

        issuesContainer.textContent =
            "Could not load issues. Please try again.";
    }
}

// Start loading the dashboard
loadIssues();
