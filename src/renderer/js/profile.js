"use strict";

(async () => {
  const [{ firstname, lastname, username, email, phone }] =
    await versions.getData();
  const profile = document.querySelector(
    ".profile__details .table.table-proInfo"
  );
  const renderHtmlMarkup = (obj, markupBody) => {
    for (let key in obj) {
      markupBody.innerHTML =
        markupBody.innerHTML +
        `<tr>
          <th>${key}</th>
          <td>${obj[key]}</td>
        </tr>`;
    }

    return;
  };

  renderHtmlMarkup({ firstname, lastname, username, email, phone }, profile);
})();
