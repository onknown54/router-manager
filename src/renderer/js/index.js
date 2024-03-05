const loginForm = document.getElementById("form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  versions.loadNestPage("load-next-page", "dashboard.html");
});
