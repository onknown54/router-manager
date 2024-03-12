"use strict";
const navLinks = document.querySelectorAll(".dashboard .navigation__link");

// handles navigation
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

document.querySelectorAll(".network__header .link").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.classList.contains("link-devices"))
      return versions.loadNestPage("load-next-page", "devices");

    return versions.loadNestPage("load-next-page", "systemInformation");
  });
});

(async function () {
  const renderHtmlMarkup = (obj, markupBody) => {
    for (let key in obj) {
      markupBody.innerHTML =
        markupBody.innerHTML +
        `<tr>
          <th>${key}</th>
          <td>${obj[key]}</td>
        </tr>`;
    }

    return true;
  };

  try {
    const table_sInfo = document.querySelector(".network .table.table-sInfo");
    const table_netInfo = document.querySelector(
      ".network .table.table-netInfo"
    );

    await versions.getDevices();

    renderHtmlMarkup(await versions.getSystemInfo(), table_sInfo); // renders system information

    renderHtmlMarkup(await versions.getMemoryInfo(), table_netInfo); // renders memory information
  } catch (er) {
    console.error("Error retrieving system information:", er);
  }
})();
