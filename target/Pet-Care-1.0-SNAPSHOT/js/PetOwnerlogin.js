var togglePasswordButton = document.getElementById("togglePasswordButton");
var passwordInput = document.getElementById("password");

var passwordVisible = false;

togglePasswordButton.addEventListener("click", togglePasswordVisibility);


function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;

}

function togglePasswordVisibility() {

    passwordVisible = !passwordVisible;

    if (passwordVisible) {
        togglePasswordButton.style.backgroundImage = "url(../images/show-password.png)";
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
        togglePasswordButton.style.backgroundImage = "url(../images/hide-password.png)";
    }
}

document.getElementById('loginButton').addEventListener('click', function () {

    getOwner();

});



function getOwner() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var username = document.getElementById('username').value;
            console.log("Redirecting to PetOwner.html with username: " + username);
            window.location.href = 'PetOwner.html?username=' + encodeURIComponent(username);
        } else if (xhr.status !== 200) {
            $("#ajaxContent").html("User not exists or incorrect password");
        }
    };
    var data = $('#PetOwnerloginform').serialize();

    xhr.open('GET', 'GetOwner?' + data);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}
