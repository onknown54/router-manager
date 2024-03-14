"use strict";

(async () => {
  const loginForm = document?.getElementById("form");
  const inpPass = document?.getElementById("password");
  const inpUser = document?.getElementById("username");
  const [{ username, password }] = await versions.getData();

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (inpPass && inpUser) {
      if (inpUser.value !== username || inpPass.value !== password) {
        alert("Please input the correct login credentials");
        return;
      }

      versions.loadNestPage("load-next-page", "dashboard");
    }
  });
})();
