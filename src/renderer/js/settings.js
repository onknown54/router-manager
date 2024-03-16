"use strict";

// handles profile updates
(() => {
  const form = document?.getElementById("form-profile");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fname = document?.getElementById("firstname").value;
    const lname = document?.getElementById("lastname").value;
    const uname = document?.getElementById("username").value;
    const emailAds = document?.getElementById("email").value;
    const phoneNum = document?.getElementById("phone").value;
    const pass = document?.getElementById("password").value;

    if (firstname && lastname && username && email && phone && password) {
      await versions
        .updateCSV([
          {
            firstname: "firstname",
            lastname: "lastname",
            username: "username",
            password: "password",
            email: "email",
            phone: "phone",
          },
          {
            firstname: fname,
            lastname: lname,
            username: uname,
            email: emailAds,
            phone: phoneNum,
            password: pass,
          },
        ])
        .then((resp) => versions.loadNestPage("load-next-page", "profile"))
        .catch(console.error);
    }
  });
})();
