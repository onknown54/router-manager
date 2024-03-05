const loginForm = document.getElementById("form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const test = document.querySelector("#form__header h3");
  test.textContent = `Chrome version: ${versions.chrome()}`;
  // createBrowserWindow();
});

function createBrowserWindow() {
  console.log("TestJS2");
  const { remote } = require("electron");
  const { BrowserWindow } = require("electron");
  console.log(BrowserWindow);

  const win = new BrowserWindow({
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    maxWidth: 750,
    maxHeight: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("../dashboard.html");
  win.show();
}

document.addEventListener("DOMContentLoaded", function () {
  (async function func() {
    const resp = await versions.ping();
    alert(resp);
  })();
});
