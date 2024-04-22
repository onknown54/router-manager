"use strict";

(async () => {
  const loginForm = document?.getElementById("form");
  const inpPass = document?.getElementById("password");
  const inpUser = document?.getElementById("username");
  const [{ username, password }] = await versions.getData();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inpPass && inpUser) {
      if (inpUser.value !== username || inpPass.value !== password)
        return alert("Please input the correct login credentials");

      versions.loadNestPage("load-next-page", "dashboard");
    } else {
      alert("username and password cannot be blank");
      versions.loadNestPage("load-next-page", "index");
    }

    return;
  });
})();
