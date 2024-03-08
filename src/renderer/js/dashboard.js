[...document.querySelectorAll(".dashboard .navigation__link")].forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    versions.loadNestPage("load-next-page", this.textContent.toLowerCase());
  });
});
