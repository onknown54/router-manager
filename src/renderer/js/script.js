"use strict";
const navLinks = document.querySelectorAll(".dashboard .navigation__link");

// handles navigation
navLinks.forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    navLinks.forEach((el) => el.classList.remove("active"));

    this.classList.add("active");
    let page = this.textContent
      .split(" ")
      .map((itm, idx) =>
        idx ? itm.substr(0, 1).toUpperCase() + itm.substr(1) : itm.toLowerCase()
      );

    versions.loadNestPage("load-next-page", page.join(""));
  });
});

// handles navigation for quick navigation cards
document.querySelectorAll(".feature .feature__item").forEach((itm) => {
  itm.addEventListener("click", function (e) {
    e.preventDefault();

    switch (this.textContent.trim().toLowerCase()) {
      case "profile information":
        versions.loadNestPage("load-next-page", "profile");
        break;

      case "connected devices":
        versions.loadNestPage("load-next-page", "devices");
        break;

      case "system information":
        versions.loadNestPage("load-next-page", "systemInformation");
        break;

      case "settings":
        versions.loadNestPage("load-next-page", "settings");
        break;

      default:
        versions.loadNestPage("load-next-page", "dashboard");
        break;
    }
  });
});

// handles naviation for "view all" links
document.querySelectorAll(".network__header .link").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.classList.contains("link-devices"))
      return versions.loadNestPage("load-next-page", "devices");

    if (this.classList.contains("link-edit"))
      return versions.loadNestPage("load-next-page", "settings");

    return versions.loadNestPage("load-next-page", "systemInformation");
  });
});
