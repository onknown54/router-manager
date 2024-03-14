"use strict";

// fetches data from main process
(async () => {
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

  try {
    const sDat = await versions.getSystemInfo();
    const netDat = await versions.getMemoryInfo();
    const [sInfo, netInfo] = [
      document.querySelector(".network .table.table-sInfo"),
      document.querySelector(".network .table.table-netInfo"),
    ];

    renderHtmlMarkup(sDat, sInfo, ".netCard--system .loader");
    renderHtmlMarkup(netDat, netInfo, ".netCard--mem .loader");
  } catch (er) {
    console.error("Error retrieving system information:", er);
  }
})();
