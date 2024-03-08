const navLinks = document.querySelectorAll(".dashboard .navigation__link");

navLinks.forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    navLinks.forEach((el) => el.classList.remove("active"));
    this.classList.add("active");

    let page = this.textContent.split(" ").map((itm, idx) => {
      return idx
        ? itm.substr(0, 1).toUpperCase() + itm.substr(1)
        : itm.toLowerCase();
    });

    versions.loadNestPage("load-next-page", page.join(""));
  });
});
