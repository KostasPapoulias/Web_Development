let params = new URLSearchParams(window.location.search);
const GlobalUsername = params.get('username');
let GlobalOwnerId ;
let petKeeperUsername;
console.log("username :" + GlobalUsername);
getPetOwnerId();




function getPetOwnerId() {
    getOwnerId(GlobalUsername).then(ownerId => {
        console.log('Owner ID:', ownerId);
        GlobalOwnerId = ownerId;
        getPets(GlobalOwnerId).then(type => {
            console.log('Type:', type);
            getPetKeepers(type);
        }).catch(error => {
            console.error('Error:', error);
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById("booking").addEventListener('click', switchToBooking);
document.getElementById("booked").addEventListener('click', switchToBooked);

function switchToBooking() {
    document.getElementById("booking_context").style.display = "block";
    document.getElementById("booked_context").style.display = "none";
}
function switchToBooked() {
    document.getElementById("booking_context").style.display = "none";
    document.getElementById("booked_context").style.display = "block";
}


document.addEventListener('DOMContentLoaded', function() {
    const changeInfoHeader = document.querySelector('#change_info_container > h3');
    const newPetHeader = document.querySelector('#newPet_container > h3');
    const changeInfoContainer = document.getElementById('change_info_container');
    const newPetContainer = document.getElementById('newPet_container');

    changeInfoHeader.addEventListener('click', function() {
        // First, remove 'expanded' from newPetContainer if it's there
        if (!newPetContainer.classList.contains('collapsed')) {
            newPetContainer.classList.toggle('collapsed');
            // Delay the toggle of 'expanded' on changeInfoContainer
            setTimeout(() => {
                changeInfoContainer.classList.toggle('expanded');
            }, 300); // Adjust delay as needed
        } else {
            changeInfoContainer.classList.toggle('expanded');
        }
        
    });

    newPetHeader.addEventListener('click', function() {
        // First, remove 'expanded' from changeInfoContainer if it's there
        if (changeInfoContainer.classList.contains('expanded')) {
            changeInfoContainer.classList.remove('expanded');
            // Delay the toggle of 'collapsed' on newPetContainer
            setTimeout(() => {
                newPetContainer.classList.toggle('collapsed');
            }, 300); // Adjust delay as needed
        } else {
            newPetContainer.classList.toggle('collapsed');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const messageHeader = document.querySelector('#message_container > h3'); // Adjust the selector as needed
    const messageContainer = document.getElementById('message_container');

    messageHeader.addEventListener('click', function() {
        messageContainer.classList.toggle('expanded');
    });
});
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

function displayPets(pets) {
    var html = '';
    for (var i = 0; i < pets.length; i++) {
        html += '<div class="pet">';
        html += '<h2>' + pets[i].name + '</h2>';
        html += '<img src="' + pets[i].photo + '" alt="' + pets[i].name + '" style="width: 100px; height: 100px;">';
        html += '</div>';
    }
    return html;
}
function getPets(GlobalOwnerId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'GetPostPets?',
            type: 'GET',
            data: {
                owner_id: GlobalOwnerId
            },
            success: function (data) {
                // Process the received data
                const ajaxContent = $('#pets');
                if (data.length > 0) {
                    ajaxContent.html(displayPets(data));
                    let type = seePetType(data);
                    resolve(type); // Resolve the Promise with the type value
                } else {
                    console.log(data + "Owner Id " + GlobalOwnerId)
                    ajaxContent.html('No pets found.');
                    resolve(null);
                }
            },
            error: function (error) {
                console.error('Error fetching pets:', error);
                reject(error);
            }
        });
    });
}

function seePetType(pets) {
    let hasCats = false;
    let hasDogs = false;
    let hasBoth = false;

    for (let i = 0; i < pets.length; i++) {
        if (pets[i].type === 'cat') {
            hasCats = true;
        } else if (pets[i].type === 'dog') {
            hasDogs = true;
        }
    }

    if (hasCats && hasDogs) {
        hasBoth = true;
    }

    if (hasBoth) {
        console.log('The pets are both cats and dogs.');
        return "all"
    } else if (hasCats) {
        console.log('The pets are cats.');
        return "catKeepers"
    } else if (hasDogs) {
        console.log('The pets are dogs.');
        return "dogKeepers"
    } else {
        console.log('There are no cats or dogs.');
    }
}

function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#booking_context');
    petKeepersList.empty();
    console.log(petKeepers)
    if (petKeepers && petKeepers.length > 0) {
        // Loop through each filtered pet keeper and display their details
        petKeepers.forEach(function (petKeeper) {
            var petKeeperElement = $('<div class="person">Username: ' + petKeeper.username + ', Name ' + petKeeper.firstname + ' ' + petKeeper.lastname + '</div>');
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
                makeBooking(petKeeper.username);
            });
            petKeepersList.append(petKeeperElement);
        });
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}

function makeBooking(petKeeperUsername) {
    // Create the form
    var form = $('<form id="form"></form>');
    form.append('<label for="name">Name:</label><br>');
    form.append('<input type="text" id="name" name="name" value="' + petKeeperUsername + '" readonly><br>'); // The name is read-only
    form.append('<label for="price">Price:</label><br>');
    form.append('<input type="text" id="price" name="price"><br>'); // You'll need to set the price
    form.append('<label for="from">From:</label><br>');
    form.append('<input type="date" id="from" name="from"><br>');
    form.append('<label for="to">To:</label><br>');
    form.append('<input type="date" id="to" name="to"><br>');
    form.append('<input type="submit" value="Submit">');

    // Add the form to the page
    $('#formBook').append(form);

    // Add an event listener to the form
    form.on('submit', function(e) {
        e.preventDefault(); // Prevent the form from being submitted normally

        // Prepare data for sending
        var formData = new FormData(form[0]);
        var data = {};
        formData.forEach((value, key) => (data[key] = value));

        data.owner_id = GlobalOwnerId;
        data.pet_keeper_username = petKeeperUsername;
        console.log(data);

        // Make the AJAX request
        $.ajax({
            url: 'GetPostBooking?',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                // Process the response
                console.log('Booking successful:', response);
            },
            error: function(error) {
                console.error('Error making booking:', error);
            }
        });
    });
}



function displayMessage(petKeepers) {
    var petKeepersList = $('#message');
    petKeepersList.empty();

    if (petKeepers && petKeepers.length > 0) {
        // Loop through each pet keeper and display their details
        petKeepers.forEach(function (petKeeper) {
            var petKeeperElement = $('<div class="person"> Name ' + petKeeper.firstname + ' ' + petKeeper.lastname + '</div>');
            var selectButton = $('<button style="display: none;">Select</button>');
            petKeeperElement.append(selectButton);
            petKeeperElement.click(function() {
                // Hide all other buttons
                $('button', petKeepersList).hide();
                // Toggle the visibility of this pet keeper's button
                selectButton.toggle();
            });
            selectButton.click(function(e) {
                e.stopPropagation(); // Prevent the petKeeperElement click event from firing
                console.log(petKeeper.username);
                petKeeperUsername = petKeeper.username;
            });
            petKeepersList.append(petKeeperElement);
        });
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}



function getPetKeepers(type) {
    $.ajax({
        url: 'GetAllPetKeepers?',
        type: 'GET',
        data: {
            type: type // Pass the type parameter to the server
        },
        dataType: 'json',
        success: function (data) {
            // Process the received data
            displayPetKeepers(data);
            displayMessage(data)
        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}


/**
 * Change the user info on the server
 * @constructor
 */
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


/**
 * Post a new pet to the server
 * @constructor
 */

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

    getOwnerId(GlobalUsername).then(ownerId => {
        console.log('Owner ID:', ownerId);
        // Use ownerId here
        data.pet_id = String(ownerId) + String(data.birthyear);
        data.owner_id = ownerId;
        console.log(data);
        // Set up and send the request
        xhr.open('POST', 'GetPostPets?');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
    }).catch(error => {
        console.error('Error:', error);
    });
}


/**
 * Get the owner ID for the given username
 * @param username
 * @returns {Promise<unknown>}
 */

function getOwnerId(username) {
    return new Promise((resolve, reject) => {
        console.log('Sending request for owner ID with username:', username); // Log the username
        $.ajax({
            url: 'ChangeUserInfo',
            type: 'GET',
            data: {
                username: username
            },
            success: function(response) {
                // Parse the response as JSON
                const responseData = JSON.parse(response);
                console.log('Received response:', responseData); // Log the parsed response
                // Resolve the promise with the owner ID
                if (responseData.ownerId) {
                    console.log('Owner ID:', responseData.ownerId);
                    resolve(responseData.ownerId);
                } else {
                    console.error('Owner ID not found in response');
                    reject('Owner ID not found in response');
                }
            },
            error: function(error) {
                // Reject the promise with the error
                console.error('Error:', error);
                reject(error);
            }
        });
    });
}

