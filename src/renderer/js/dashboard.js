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

// renders system information
(async function () {
  try {
    const systemInfo = await versions.getSystemInfo();
    const table = document.querySelector(".network .table.table-sInfo");

    for (let key in systemInfo) {
      table.innerHTML =
        table.innerHTML +
        `<tr>
          <th>${key}</th>
          <td>${systemInfo[key]}</td>
        </tr>`;
    }
  } catch (error) {
    console.error("Error retrieving system information:", error);
  }
})();

// renders network information
(async function () {
  try {
    const networkInfo = await versions.getNetworkInfo();
    const table = document.querySelector(".network .table.table-netInfo");

    for (let key in networkInfo) {
      table.innerHTML =
        table.innerHTML +
        `<tr>
          <th>${key}</th>
          <td>${networkInfo[key]}</td>
        </tr>`;
    }

    console.log(networkInfo);
  } catch (error) {
    console.error("Error retrieving network information:", error);
  }
})();
