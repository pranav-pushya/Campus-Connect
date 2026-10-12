
const issueForm = document.getElementById("issueForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");

issueForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    formError.classList.add("hidden");
    formSuccess.classList.add("hidden");

    const issueData = {
        title: title.value.trim(),
        description: description.value.trim(),
        category: category.value
    };

    if (!issueData.title || !issueData.description || !issueData.category) {
        formError.textContent = "Please fill in all fields.";
        formError.classList.remove("hidden");
        return;
    }

    try {
        console.log("Sending issue:", issueData);

        const response = await apiFetch("/api/issues", {
            method: "POST",
            body: JSON.stringify(issueData)
        });

        const responseText = await response.text();
        console.log("POST STATUS:", response.status);
        console.log("POST RESPONSE:", responseText);

        if (!response.ok) {
            throw new Error(responseText || "Issue submission failed.");
        }

        formSuccess.textContent = "Issue submitted successfully!";
        formSuccess.classList.remove("hidden");
        issueForm.reset();
    } catch (error) {
        console.error("Submission error:", error);
        formError.textContent = error.message || "Could not submit issue.";
        formError.classList.remove("hidden");
    }
});