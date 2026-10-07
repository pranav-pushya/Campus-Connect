const issueForm =document.getElementById("issueForm");
const title = document.getElementById("title");
const description =document.getElementById("description");
const category =document.getElementById("category");
const formError =document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");

//form submission 
issueForm.addEventListener("submit", function(event) {
 event.preventDefault();   
    formError.classList.add("hidden");
    formSuccess.classList.add("hidden");
    //to get the user input
    const titleValue =title.value.trim();
    const descriptionValue =description.value.trim();
    const categoryValue =category.value;
        if (titleValue === "") {
             formError.textContent ="Please enter the issue title.";
        formError.classList.remove("hidden");
        title.focus();
        return;
    }
    if (descriptionValue === "") {
        formError.textContent ="Please enter the issue description.";
        formError.classList.remove("hidden");
        description.focus();
        return;
    }
    //issue category
 if (categoryValue === "") {
        formError.textContent ="Please select a category.";
        formError.classList.remove("hidden");
        category.focus();
        return;
    }
    formSuccess.textContent ="Issue submitted successfully!";
    formSuccess.classList.remove("hidden");
    issueForm.reset();
});