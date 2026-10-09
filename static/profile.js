requireAuth();
(async function () {
  const res = await apiFetch("/api/me");
  const user = await res.json();
  document.getElementById("name").textContent = user.name;
  document.getElementById("email").textContent = user.email;
  document.getElementById("joined").textContent = formatDate(user.created_at);
})();
