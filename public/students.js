document.addEventListener("DOMContentLoaded", function(event) {
    let studentsList = document.querySelector("#students");

    // Hide and display the list
    studentsList.style.display = "none";
    studentsList.style.display = "block";

    // Add a link to /students/create
    let createLink = document.createElement("a");
    createLink.setAttribute("href", "/students/create");
    createLink.textContent = "Create new student";
    studentsList.append(createLink);

    // Add event listener to test button
    let testButton = document.querySelector("#test");
    testButton.addEventListener("click", function() {
      alert("CLICKED!");
    });
});
