"use strict";

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

const renderHtmlMarkup = (obj, markupBody, query) => {
  const loader = document.querySelector(query);

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

// fetches data from main process
(async () => {
  try {
    const [sInfo, netInfo] = [
      document.querySelector(".network .table.table-sInfo"),
      document.querySelector(".network .table.table-netInfo"),
    ];
    const sDat = await versions.getSystemInfo();
    const netDat = await versions.getMemoryInfo();

    renderHtmlMarkup(sDat, sInfo, ".netCard--system .loader");
    renderHtmlMarkup(netDat, netInfo, ".netCard--mem .loader");
  } catch (er) {
    console.error("Error retrieving system information:", er);
  }
})();
