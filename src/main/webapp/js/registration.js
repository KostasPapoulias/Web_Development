
var registerButton = document.getElementById("RegisterButton");
var password1Input = document.getElementById("password1");
var password2Input = document.getElementById("password2");
var messageElement = document.getElementById("MatchPassmessage");
var togglePasswordButton1 = document.getElementById("togglePasswordButton1");
var togglePasswordButton2 = document.getElementById("togglePasswordButton2");
var strengthMessage  = document.getElementById("strengthMessage");
var userType = document.getElementById("user-type");
var form2 = document.getElementById("form2");
var form1 = document.getElementById("form");
var cathosting = document.getElementById("cathosting");
var doghosting = document.getElementById("doghosting");
var catprice = document.getElementById("priceForCat");
var dogprice = document.getElementById("priceForDog");
var catpriceinput = document.getElementById("priceForCatInput");
var dogpriceinput = document.getElementById("priceForDogInput");
var petaccomodation = document.getElementById("PetAccommodation");
var doglabel = document.getElementById("doglabel");
var checkaddress = document.getElementById("checkaddress");
var mapDiv = document.getElementById("mapId");
var body = document.getElementById("body");
var map;




var passwordVisible1 = false;
var passwordVisible2 = false;
var isRegisterWeak = false;
var parseData;

var forbiddenWords = ["cat", "dog", "gata", "skulos"];

var inputElements = document.querySelectorAll("input");

checkaddress.addEventListener("click",checkAddress);

cathosting.addEventListener("change", showCatprices);
doghosting.addEventListener("change", showDogprices);

petaccomodation.addEventListener("change", changeaccomodation);

userType.addEventListener("input", createForm);

togglePasswordButton1.addEventListener("click", togglePasswordVisibility1);
togglePasswordButton2.addEventListener("click", togglePasswordVisibility2);

registerButton.addEventListener("click", doRegister);

password1Input.addEventListener("input", checkPasswordsMatch);
password2Input.addEventListener("input", checkPasswordsMatch);

password1Input.addEventListener("input",isStrongPassword);

function togglePasswordVisibility1() {

    passwordVisible1 = !passwordVisible1;

    if (passwordVisible1) {
        togglePasswordButton1.style.backgroundImage = "url(../images/show-password.png)";
        password1Input.type = "text";
    } else {
        password1Input.type = "password";
        togglePasswordButton1.style.backgroundImage = "url(../images/hide-password.png)";
    }
}


function togglePasswordVisibility2() {

    passwordVisible2 = !passwordVisible2;

    if (passwordVisible2) {
        togglePasswordButton2.style.backgroundImage = "url(../images/show-password.png)";
        password2Input.type = "text";
    } else {
        togglePasswordButton2.style.backgroundImage = "url(../images/hide-password.png)";
        password2Input.type = "password";
    }
}

function checkPasswordsMatch(){
    var password1 = password1Input.value;
    var password2 = password2Input.value;

    if(password2 != ""){
        messageElement.style.fontSize = "25px";
        if (password2 == password1) {
            messageElement.style.display = "block";
            messageElement.style.color = "green";
            messageElement.textContent = "Passwords match!";
            password2Input.style.border = null;
        } else {
            messageElement.style.display = "block";
            messageElement.style.color = "purple";
            messageElement.textContent = "Passwords do not match!";
            password2Input.style.border = "2px solid red";
        }
    }
}

function  doRegister(){

//    if(isRegisterWeak){
//        makeRequireTrue();
//    }else{
//        alert("password is weak!");
//    }
    

}

function makeRequireTrue(){
    inputElements.forEach(function (input) {
        if(input.id != "job" && input.id != "personalpage" && input.id != "telephone"){
            input.required = true;
        }
        
    });
}

function makeRequirefalse(){
    
    inputElements.forEach(function (input) {
        input.required = false;
    });
}



function isStrongPassword(){
    var isWeak = false;
    var isStrong = false;
    var password = password1Input.value;

    for (var i = 0; i < forbiddenWords.length; i++) {
        if (password.includes(forbiddenWords[i])) {
            isWeak = true;
            break;
        }
    }
    
    var numbers = password.replace(/[^0-9]/g, '');
    if (numbers.length >= password.length / 2) {
        isWeak = true;
    }
    
    var hasSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,./]/.test(password);
    var hasUppercase = /[A-Z]/.test(password);
    var hasLowercase = /[a-z]/.test(password);
                
    if (hasSymbol && hasUppercase && hasLowercase && numbers) {
        isStrong = true;
    }

    strengthMessage.style.fontSize = "22px";
    

    if (isWeak) {
        strengthMessage.textContent = "Weak password!";
        strengthMessage.style.color = "#B22222";
        isRegisterWeak = false;
    } else if (isStrong) {
        strengthMessage.textContent = "Strong password!";
        strengthMessage.style.color = "#006400";
        isRegisterWeak = true;
    } else {
        strengthMessage.textContent = "Medium password!";
        strengthMessage.style.color = "#483D8B";
        isRegisterWeak = true;
    }

    setTimeout(isStrongPassword, 1000);
}

function createForm(){
    if(userType.value == "Pet Keeper"){
        form1.style.marginTop = "-295px";
        form2.style.display = "block";
    }else if(userType.value == "Pet Owner"){
        form1.style.marginTop = "-35px";
        form2.style.display = "none";
    }
}

function showCatprices(){
    if(cathosting.checked){
        catprice.style.display = "inline-block";
        catpriceinput.style.display = "inline-block";
    }else if(!cathosting.checked){
        catprice.style.display = "none";
        catpriceinput.style.display = "none";
    }
}

function showDogprices(){
    if(doghosting.checked){
        dogprice.style.display = "inline-block";
        dogpriceinput.style.display = "inline-block";
    }else if(!doghosting.checked){
        dogprice.style.display = "none";
        dogpriceinput.style.display = "none";
    }
}

function changeaccomodation(){
    if(petaccomodation.value == "Exterior"){
        doglabel.style.display = "none";
        doghosting.checked = false;
        showDogprices();
    }else{
        doglabel.style.display = "inline-block";
    }
}


async function checkAddress(){

    const street = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;
    const postalcode = document.getElementById("postalcode").value;

    const options = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/forward',
        params: {
            street: street,
            postalcode: postalcode,
            city: city,
            country: country
        },
        headers: {
            'X-RapidAPI-Key': '82e53d32f8mshfd4be245ce65f24p1e1961jsn6d8346304fdc',
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        displaymessage = document.getElementById("displayLocMessage");

        if (Object.keys(response.data).length === 0) {
            displaymessage.textContent = "Location didn't found!";
        } else {  
            displaymessage.textContent = "";
            parseData = response.data[0];
            

            openMap();
            checkHeraklion();

        }

        
    } catch (error) {
        console.error(error);
    }
}


function checkHeraklion(){
    if(!parseData.display_name.includes("Heraklion")){
        window.alert("The service is only available in Heraklion at the moment.");
    }
}


function openMap(){
    body.style.marginLeft = "-300px";
    mapDiv.style.display = "inline";
    form1.style.marginLeft = "20px";
    form2.style.marginLeft = "20px";
    mapDiv.style.marginLeft = "-100px";


    if (!map) {
        // If the map variable doesn't exist, create a new map
        map = new OpenLayers.Map("mapId");
        map.addLayer(new OpenLayers.Layer.OSM());

        var lonLat = new OpenLayers.LonLat( parseData.lon,parseData.lat).transform(new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject());

        var zoom = 10;

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);

        markers.addMarker(new OpenLayers.Marker(lonLat));

        map.setCenter(lonLat, zoom);
    } else {
        
        var newLonLat = new OpenLayers.LonLat( parseData.lon,parseData.lat).transform(new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject());

        var newmarkers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(newmarkers);
        newmarkers.addMarker(new OpenLayers.Marker(newLonLat));

        map.setCenter(newLonLat, zoom);
    }
}


// Function to create an HTML table from JSON data
function createTableFromJSON(data) {
    let html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            html += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
        }
    }
    html += "</table>";
    return html;
}

// Function to handle form submission and AJAX request
function PostUser() {
    const myForm1 = document.getElementById('form');
    const myForm2 = document.getElementById('form2');

    const formData1 = new FormData(myForm1);
    const formData2 = new FormData(myForm2);

    const formData = new FormData();

    if (userType.value == "Pet Keeper") {
        formData1.forEach((value, key) => {
            formData.append(key, value);
        });

        // Append formData2 to combinedFormData
        formData2.forEach((value, key) => {
            formData.append(key, value);
        });

    } else if (userType.value == "Pet Owner") {
        formData1.forEach((value, key) => {
            formData.append(key, value);
        });
    }

    const xhr = new XMLHttpRequest();

    // Event handler for the response
    xhr.onload = function () {
        const ajaxContent = $('#ajaxContent');
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                ajaxContent.html("Successful Registration. Now please log in!<br> Your Data");
                ajaxContent.append(createTableFromJSON(responseData));
            } else {
                ajaxContent.html('Request failed. Returned status of ' + xhr.status + "<br>");
                try {
                    const responseData = JSON.parse(xhr.responseText);
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            ajaxContent.append(`<p style='color:red'>${key} = ${responseData[key]}</p>`);
                        }
                    }
                } catch (e) {
                    ajaxContent.append(`<p style='color:red'>Error parsing response: ${xhr.responseText}</p>`);
                }
            }
        }
    };

    // Prepare data for sending
    const data = {};
    formData.forEach((value, key) => (data[key] = value));


    // Set up and send the request
    xhr.open('POST', 'Register?');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}
