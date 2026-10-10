const issues = [
    {
        id: 1,
        title: "Power Sockets not working",
        description:"Many power sockets of Room 509 are not working.Please inspect and repair as soon as possible.",
        category: "Classroom",
        status: "Open",
        created_by_name : "Student",
        created_at: "2026-10-04T10:00:00Z"
    },
    {
        id: 2,
        title: "Water Cooler Maintenance",
        description:"Water cooler int Block T is not working properly and needs to be checked out and repaired.",
        category: "Campus",
        status: "In Progress",
        created_by_name : "Student",
        created_at: "2026-10-07T10:00:00Z"
    },
    {
        id: 3,
        title: "Lost ID Card",
        description:"A university ID card was found near the cafeteria.",
        category: "Lost & Found",
        status: "Open",
        created_by_name : "Student",
        created_at: "2026-10-02T10:00:00Z"
    },
    {
        id: 4,
        title: "Wi-Fi not connecting",
        description:"Campus Wi-Fi is not connecting on multiple devices and the connection frequently disconnects.",
        category: "Digital IT Services",
        status: "In Progress",
        created_by_name : "Student",
        created_at: "2026-10-07T10:00:00Z"
    },
    {
        id: 5,
        title: "Broken benches in classroom",
        description:"Benches in Room 501 are broken, benches need repair as soon as possible.",
        category: "Classroom",
        status: "Resolved",
        created_by_name : "Faculty",
        created_at: "2026-10-04T10:00:00Z"
    },
    {
        id: 6,
        title: "Washroom maintenance",
        description:"Washrooms need proper maintenance and cleaning to maintain hygine.",
        category: "Campus",
        status: "Resolved",
        created_by_name : "Student",
        created_at: "2026-10-03T10:00:00Z"
    },
    {
        id: 7,
        title: "Wallet found",
        description:"A black wallet was found near the sports complex.",
        category: "Lost & Found",
        status: "Open",
        created_by_name : "Student",
        created_at: "2026-10-05T10:00:00Z"
    },
    {
        id: 8,
        title: "Student portal login issue",
        description:"Unable to log into the student portal.",
        category: "Digital IT Services",
        status: "Open",
        created_by_name : "Student",
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

    const filteredIssues = issues.filter(function(issue) {
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
updateStatistics(issues);
renderIssues(issues);