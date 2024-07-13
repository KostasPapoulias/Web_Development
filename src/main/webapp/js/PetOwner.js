window.onload = function () {
    getAllKeepers();
};


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

// $(document).ready(function() {
//     $('#changeInfo').on('submit', function(e) {
//         e.preventDefault();
//
//         var username = $('#username').val();
//         var password = $('#password').val();
//         var firstname = $('#firstname').val();
//         var lastname = $('#lastname').val();
//         var phone = $('#phone').val();
//
//         $.ajax({
//             url: 'ChangeUserInfo', // Replace with your server endpoint
//             type: 'POST',
//             data: {
//                 username: username,
//                 password: password,
//                 firstname: firstname,
//                 lastname: lastname,
//                 phone: phone
//             },
//             success: function(response) {
//                 // Handle the response from the server
//                 console.log(response);
//             },
//             error: function(error) {
//                 // Handle any errors
//                 console.error('Error:', error);
//             }
//         });
//     });
// });

function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#booking');
    petKeepersList.empty();

    if (petKeepers && petKeepers.length > 0) {
        // Loop through each pet keeper and display their details
        petKeepers.forEach(function (petKeeper) {
            var petKeeperElement = $('<p>Username: ' + petKeeper.username + ', First Name: ' + petKeeper.firstname + ', Last Name: ' + petKeeper.lastname + '</p>');
            var bookButton = $('<button style="display: none;">Book</button>');
            petKeeperElement.append(bookButton);
            petKeeperElement.click(function() {
                // Hide all other buttons
                $('button', petKeepersList).hide();
                // Toggle the visibility of this pet keeper's button
                bookButton.toggle();
            });
            bookButton.click(function(e) {
                e.stopPropagation(); // Prevent the petKeeperElement click event from firing
                console.log(petKeeper.username);
            });
            petKeepersList.append(petKeeperElement);
        });
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}


function getAllKeepers() {
    // Make an AJAX request to fetch pet keepers
    $.ajax({
        url: 'GetAllPetKeepers?', // Replace with the actual URL to your servlet
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Process the received data
            displayPetKeepers(data);
        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}
let params = new URLSearchParams(window.location.search);
const GlobalUsername = params.get('username');
console.log("username :" + GlobalUsername);

function ChangeUserInfo() {
    const formElement = document.getElementById('changeInfo');

    const xhr = new XMLHttpRequest();

    // Event handler for the response
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.getResponseHeader('Content-Type') === 'application/json') {
                    const responseData = JSON.parse(xhr.responseText);
                    console.log('Response:', responseData); // Log the response
                } else {
                    console.log('Unexpected response:', xhr.responseText);
                }
            } else {
                console.log('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    // Prepare data for sending
    const formData = new FormData(formElement);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data.username = GlobalUsername;
    console.log(data);
    // Set up and send the request
    xhr.open('POST', 'ChangeUserInfo?');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function PostPet() {
    const formElement = document.getElementById('petForm');

    const xhr = new XMLHttpRequest();

    // Event handler for the response
    xhr.onload = function () {
        const ajaxContent = $('#newPet');
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                ajaxContent.html("Successful Pet Registration. <br> Your Data");
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
    const formData = new FormData(formElement);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data.pet_id = String(data.owner_id) + String(data.birthyear);
    console.log(data);
    // Set up and send the request
    xhr.open('POST', 'CreatePet?');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}


function getOwnerId(username) {
    $.ajax({
        url: 'CreatePet', // Replace with your server endpoint
        type: 'GET',
        data: {
            username: username
        },
        success: function(response) {
            // Handle the response from the server
            console.log('Owner ID:', response.ownerId);
        },
        error: function(error) {
            // Handle any errors
            console.error('Error:', error);
        }
    });
}

