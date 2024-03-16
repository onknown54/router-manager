"use strict";

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

(async () =>
  await versions
    .getData()
    .then(([{ firstname, lastname, username, email, phone }]) => {
      const profile = document.querySelector(
        ".profile__details .table.table-proInfo"
      );
      renderHtmlMarkup(
        { firstname, lastname, username, email, phone },
        profile
      );
    })
    .catch(console.error))();
