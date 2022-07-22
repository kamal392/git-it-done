var userFormEl = document.querySelector("#user-form");
var userInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonEl = document.querySelector("#language-buttons");


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
        // console.log(response);
        response.json().then(function (data) {
          // console.log(data);
          displayRepos(data, user);
          // check if api has paginated issues
          if(response.headers.get("Link")){
            dispalyWarning(repo);

          }
        })
      } else {
          // if not succesful, redirect to homepage
          // document.location.replace("index.html");
        // alert("Error:Github User Not Found");
      }
    }).catch(function(){
      alert("Unable to connect to Github");
    })
}

getUserRepos("");




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

    //creat a container for each repo with a link . that will nevigate to the next page.
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "single-repo.html?repo=" + repoName);

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

var getFeaturedRepos = function(language){

   var apiUrl =
     "https://api.github.com/search/repositories?q=" +
     language +
     "+is:featured&sort=help-wanted-issues";

   fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function(data){
        displayRepos(data.items,language);
      })
       
    }
    else{
      alert("Error:GitHub User Not Found");
    }


   });
};

// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);

var buttonClickHandler = function(event){
  var language = event.target.getAttribute("data-language")
  // console.log(language);
  if (language){
    getFeaturedRepos(language);
    // clear old content
    repoContainerEl.textContent = "";
  }
}











// add event listeners to the language button
languageButtonEl.addEventListener("click", buttonClickHandler);
