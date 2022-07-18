var userFormEl = document.querySelector("#user-form");
var userInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  //pevent page from refereshing
  event.preventDefault();

  //get value from input element
  var username = userInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    ////////// clear old content
    repoContainerEl.textContent = "";
    userInputEl.value = "";
  } else {
    alert("Please enter a Github username");
  }

  console.log(event);
};

function getUserRepos(user) {
  //format a get request to url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";
  //   make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert("Error:Github User Not Found");
      }
    }).catch(function(){
      alert("Unable to connect to Github");
    })
}

getUserRepos("");

// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);
// Data will be send from getUserRepos() to displayRepos()
var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found";
    return;
  }
  console.log(repos);
  console.log(searchTerm);

  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  //loops for repos
  for (var i = 0; i < repos.length; i++) {
    //  format for repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    //creat a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    //creat a span element to hold repository name

    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    //apend to contianer
    repoEl.appendChild(titleEl);

    // Create a status element

    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    //check if current repo has issues or not

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        "issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    //append contianer to the dom
    repoContainerEl.appendChild(repoEl);
  }
};
