window.onload = () => {

  document.getElementById("search").addEventListener("input", (event) => {
    // Remove newlines
    // TODO: Prevent carriage returns as well
    event.target.value = event.target.value.replace(/\n/g, "");
  });

  document.getElementById("search").addEventListener("change", (event) => {
    //console.log(event.target.value);
  });

  // Lets go ahead and setup a proper debounce on the search bar
  let searchTimer;
  const searchDebounceTime = 3000; // time in ms, 5 seconds here

  const searchFunc = async () => {
    const response = await fetch(`/api/student?q=${document.getElementById("search").value}`);
    const results = await response.json();
    console.log(results);

    const resultsPane = document.getElementById("search-results");

    let htmlResults = generateHTMLSearchResults(results);

    resultsPane.innerHTML = htmlResults;
  };

  document.getElementById("search").addEventListener("keyup", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchFunc, searchDebounceTime);
  });

  document.getElementById("search").addEventListener("keydown", (event) => {
    clearTimeout(searchTimer);
    if (event.keyCode === 13) {
      // User has pressed enter
      searchFunc();
    }
  });

};

function generateHTMLSearchResults(res) {
  let generated = "";

  for (let i = 0; i < res.length; i++) {
    generated +=
`
<!--<a href="/student/${res[i].student_id}">-->
  <section onclick="redirectToStudent(${res[i].student_id})">
    <p class="name">${res[i].first_name} ${res[i].last_name}</p>
    <p class="id">${res[i].student_id}</p>
  </section>
<!--</a>-->
`;
  }

  return generated;
}

function redirectToStudent(id) {
  window.location.href = `/student/${id}`;
}
