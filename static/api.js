
 // Store the name used for the authentication token
const TOKEN_KEY = "token";

// Get the saved authentication token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Log out the user
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login.html";
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = "/login.html";
    }
}

// Send requests to the backend API
async function apiFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = getToken();

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(path, {
        ...options,
        headers
    });

    if (res.status === 401) {
        logout();
        throw new Error("Not authenticated");
    }

    return res;
}

// Format a date for display
function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN");
}

// Get a useful error message from the backend
function getErrorMessage(data) {
    if (data && typeof data.detail === "string") {
        return data.detail;
    }

    return "Please check your input and try again.";
}
