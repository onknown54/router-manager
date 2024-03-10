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

const renderHtmlMarkup = (obj, markupBody) => {
  for (let key in obj) {
    markupBody.innerHTML =
      markupBody.innerHTML +
      `<tr>
          <th>${key}</th>
          <td>${obj[key]}</td>
        </tr>`;
  }
};

(async function () {
  try {
    const table_sInfo = document.querySelector(".network .table.table-sInfo");
    const table_netInfo = document.querySelector(
      ".network .table.table-netInfo"
    );
    await versions.getDevices();

    // renders system information
    renderHtmlMarkup(await versions.getSystemInfo(), table_sInfo);

    // renders network information
    renderHtmlMarkup(await versions.getNetworkInfo(), table_netInfo);
  } catch (er) {
    console.error("Error retrieving system information:", er);
  }
})();
