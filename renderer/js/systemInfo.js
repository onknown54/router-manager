"use strict";

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

// gets system information
(async () =>
  await versions
    .getSystemInfo()
    .then((resp) => {
      const stable = document.querySelector(".network .table.table-sInfo");
      renderHtmlMarkup(resp, stable, ".netCard--system .loader");
    })
    .catch(console.error))();

// gets memory information
(async () =>
  await versions
    .getMemoryInfo()
    .then((resp) => {
      const netTable = document.querySelector(".network .table.table-netInfo");
      renderHtmlMarkup(resp, netTable, ".netCard--mem .loader");
    })
    .catch(console.error))();

// gets graphics information
(async () =>
  await versions
    .getGraphicsInfo()
    .then((resp) => {
      const netTable = document.querySelector(
        ".network .table.table-graphicsInfo"
      );
      renderHtmlMarkup(resp, netTable, ".netCard--graphicsInfo .loader");
    })
    .catch(console.error))();

// gets CPU information
(async () =>
  await versions
    .getCPUInfo()
    .then((resp) => {
      const netTable = document.querySelector(".network .table.table-cpuInfo");
      renderHtmlMarkup(resp, netTable, ".netCard--cpuInfo .loader");
    })
    .catch(console.error))();
