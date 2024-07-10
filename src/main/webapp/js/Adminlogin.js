var togglePasswordButton = document.getElementById("togglePasswordButton");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");

var passwordVisible = false;

togglePasswordButton.addEventListener("click", togglePasswordVisibility);


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

    if (usernameInput.value == "admin" && passwordInput.value == "admin12") {
        window.location.href = 'Admin.html';
    } else {
        $("#ajaxContent").html("User not exists or incorrect password");
    }


});
