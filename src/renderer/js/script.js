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

// handles naviation for "view all" links
document.querySelectorAll(".network__header .link").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.classList.contains("link-devices"))
      return versions.loadNestPage("load-next-page", "devices");

    return versions.loadNestPage("load-next-page", "systemInformation");
  });
});
