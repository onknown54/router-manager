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
[...document.querySelectorAll(".feature .feature__item")].forEach((itm) => {
  itm.addEventListener("click", function (e) {
    e.preventDefault();

    switch (this.textContent.trim().toLowerCase()) {
      case "profile information":
        versions.loadNestPage("load-next-page", "systemInformation");
        break;

      case "connected devices":
        versions.loadNestPage("load-next-page", "devices");
        break;

      case "system information":
        versions.loadNestPage("load-next-page", "systemInformation");
        break;

      case "settings":
        versions.loadNestPage("load-next-page", "systemInformation");
        break;

      default:
        versions.loadNestPage("load-next-page", "systemInformation");
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

    return versions.loadNestPage("load-next-page", "systemInformation");
  });
});

// fetches data from main process
(async () => {
  const renderHtmlMarkup = (obj, markupBody) => {
    const loader = document.getElementById("loader");

    for (let key in obj) {
      markupBody.innerHTML =
        markupBody.innerHTML +
        `<tr>
          <th>${key}</th>
          <td>${obj[key]}</td>
        </tr>`;
    }

    loader?.classList.add("hide");
  };

  try {
    const [sInfo, netInfo] = [
      document.querySelector(".network .table.table-sInfo"),
      document.querySelector(".network .table.table-netInfo"),
    ];
    const sDat = await versions.getSystemInfo();
    const netDat = await versions.getMemoryInfo();

    renderHtmlMarkup(sDat, sInfo);
    renderHtmlMarkup(netDat, netInfo);
  } catch (er) {
    console.error("Error retrieving system information:", er);
  }
})();
