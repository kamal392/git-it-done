
var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

// variable to get the repo name
var getRepoName = function(){
  //grab repo name from url query string 
  var queryString = document.location.search;
  // use split() to the split the querry parameter , get the name of the repo which will be in index 1
  var repoName =queryString.split("=")[1];

  getRepoIssues(repoName);
  repoNameEl.textContent = repoName;

  if (repoName){
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
  }

  else{
    document.location.replace("index.html");
  }

  
};

var getRepoIssues = function (repo) {
    // format the github api url
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl).then(function (response) {
    
    // request was succesfull
    if (response.ok) {
      response.json().then(function (data) {
        //   console.log("data looks like", data);
        displayIssues(data);

        //  check If api has paginated issues
        if (response.headers.get("link")) {

          dispalyWarning(repo);
          // displayWarning(repo);
        }
      });
    } else {
  
      document.location.replace("index.html");
    }
  });

};

// dispaly issues
var displayIssues = function (issues) {
  // creat a  link element to take the issue on Github
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
//   loop over given issues
  for (var i = 0; i < issues.length; i++) {
    //creat a link element to take users to the issue on Github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    //creat span to hold issue title

    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //   append to container
    issueEl.appendChild(titleEl);

    //creat a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    issueContainerEl.appendChild(issueEl);
  }
};

//creat a new display warning function
var dispalyWarning = function(repo){
    // add text to warning contianer
    limitWarningEl.textContent = "To see more than 30 issues,visit" + " ";
//   creat link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "see More Issues on github.com";
    linkEl.setAttribute ("href","https:github.com/" + repo + "/issues");
    linkEl.setAttribute("target","_blank");

    // append that to the warning container
    limitWarningEl.appendChild(linkEl);

};

//
// getRepoIssues();
getRepoName();
