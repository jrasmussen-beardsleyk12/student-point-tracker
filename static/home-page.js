window.onload = () => {

  const searchText = document.getElementById("search-text-field");

  mdc.textField.MDCTextField.attachTo(document.getElementById("search-bar"));

  searchText.addEventListener("input", (event) => {
    // Remove newlines
    // TODO: PRevent carriage returns as well
    event.target.value = event.target.value.replace(/\n/g, "");
  });

  // Lets go ahead and setup a proper debounce on the search bar
  let searchTimer;
  const searchDebounceTime = 3000; // time in ms, 3 seconds here

  const searchFunc = async () => {
    if (searchText.value.length === 0) {
      return;
    }

    const response = await fetch(`/api/student?q=${searchText.value}`);
    const results = await response.json();

    const resultsPane = document.getElementById("search-results");

    let htmlResults = generateHTMLSearchResults(results);

    resultsPane.innerHTML = htmlResults;

    new mdc.list.MDCList(document.querySelector('.mdc-list'));
  };

  searchText.addEventListener("keyup", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchFunc, searchDebounceTime);
  });

  searchText.addEventListener("keydown", (event) => {
    clearTimeout(searchTimer);
    if (event.keyCode === 13) {
      // User has pressed enter
      searchFunc();
    }
  });
};

function generateHTMLSearchResults(res) {
  let generated = "";

  generated += "<ul class='mdc-list mdc-list--two-line'>";

  for (let i = 0; i < res.length; i ++) {
    let tabindex = (i === 0) ? "tabindex='0'" : "";

    generated +=
`
<li class="mdc-list-item" ${tabindex} onclick="redirectToStudent(${res[i].student_id})" onkeydown="keyRedirectToStudent(event, ${res[i].student_id})">
  <span class="mdc-list-item__ripple"></span>
  <span class="mdc-list-item__text">
    <span class="mdc-list-item__primary-text">${res[i].first_name} ${res[i].last_name}</span>
    <span class="mdc-list-item__secondary-text">Student ID: ${res[i].student_id}</span>
  </span>
</li>
`;

    if (i !== res.length - 1) {
      generated += "<li role='separator' class='mdc-list-divider'></li>";
    }
  }

  generated += "</ul>";

  return generated;
}

function redirectToStudent(id) {
  window.location.href = `/student/${id}`;
}

function keyRedirectToStudent(event, id) {
  event = event || window.event;
  if (event.keyCode === 13) {
    // User pressed enter
    redirectToStudent(id);
  }
}
