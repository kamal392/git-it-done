//reference to the issues container
var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function (repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl)
    .then(function (response) {
    //   console.log("response is ", response);
      // request was succesfull
      if (response.ok) {
        response.json().then(function (data) {
        //   console.log("data looks like", data);
          displayIssues(data);
        });
      } else {
        alert("There was a problem with your request");
      }
    });
    // .catch((error) => {
    //   console.error("Error!!!!:", error);
    // });
};

// dispaly issues
var displayIssues = function (issues) {
  // creat a  link element to take the issue on Github
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
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
//
getRepoIssues("kamal392/git-it-done");
