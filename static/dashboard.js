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
    issuesContainer.innerHTML = "";    
    if (data.length === 0) {
        issuesContainer.innerHTML = `
            <p class="message">No issues found.</p>
        `;
        return;
    }
    data.forEach(function(issue) {
        const card =
            document.createElement("div");
        card.className =
            "issue-card";
        card.innerHTML = `

            <div class="issue-card-header">
                <div>
                    <h3>${issue.title}</h3>
                    <span class="category-badge">${issue.category}</span>
                </div>
                <span class="status-badge ${getStatusClass(issue.status)}">
                    ${issue.status}
                </span>
            </div>
            <p class="issue-card-description">${issue.description}</p>


            <div class="issue-card-footer">

                <span> ${issue.createdAt}</span>

                <a href="issue.html?id=${issue.id}" class="button primary-button">View Details</a>
            </div>
        `;
        issuesContainer.appendChild(card);
    });
}
function filterIssues() {
    const selectedCategory =
        categories.value;
    const selectedStatus =
        statusFilter.value;
    const filteredIssues =
        issues.filter(function(issue) {
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