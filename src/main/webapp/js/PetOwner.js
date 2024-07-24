let params = new URLSearchParams(window.location.search);
const GlobalUsername = params.get('username');
let GlobalOwnerId ;
let petKeeperUsername;
console.log("username :" + GlobalUsername);

retrieveData();


//TODO ADDITIONAL INFORMATION DISPLAYED

/**
 * asynchronous call on getting pet owner's id thus call made again
 * retrieves pet owner's id
 * retrieves pet owner's registered pets
 * gets pets' type
 * retrieves available pet keepers according on pets' type
 * displays pet keepers on screen - 
 *  - buttons are made and booking form is created
 * to be fixed messages pet keepers based on booking
 */

function retrieveData() {
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


//CONTROLLERS
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
        if (!newPetContainer.classList.contains('collapsed')) {
            newPetContainer.classList.toggle('collapsed');
            setTimeout(() => {
                changeInfoContainer.classList.toggle('expanded');
            }, 300); 
        } else {
            changeInfoContainer.classList.toggle('expanded');
        }
        
    });

    newPetHeader.addEventListener('click', function() {
        if (changeInfoContainer.classList.contains('expanded')) {
            changeInfoContainer.classList.remove('expanded');
            setTimeout(() => {
                newPetContainer.classList.toggle('collapsed');
            }, 300); 
        } else {
            newPetContainer.classList.toggle('collapsed');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const messageHeader = document.querySelector('#message_container > h3'); 
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
/**
 * displays pet owner's registered pets
 * @param {*} pets 
 * @returns 
 */
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
/**
 * 
 * @param {*} GlobalOwnerId 
 * @returns 
 */
// Declare a global array to store pets
let petsArray = [];

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
                    // Save the pets data into the global array
                    petsArray = data;
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
// in the displayPetKeepers, i want , if the type is both to have an option to decide between the dog keeper and the cat keeper and by default it will have the dog keeper and it will show only the selected one

/**
 * returns the type that petOwner has registered
 */
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

//SEPARATE FOR MAKE BOOKING
function displayPetKeepers(petKeepers, type) {
    var petKeepersList = $('#booking_context');
    petKeepersList.empty();
    console.log(petKeepers);
    console.log(unbookedPets);
    if (petKeepers && petKeepers.length > 0) {
        petKeepers.forEach(function (petKeeper) {
            var petKeeperElement = $('<div class="person">' + petKeeper.firstname + ' ' + petKeeper.lastname + '<br>' + petKeeper.city + ' ' + petKeeper.address + '<br>' + petKeeper.telephone + '<br>' + petKeeper.propertydescription +'<br>' +'</div>');
            var bookForText = $('<span>Book for: </span>');
            petKeeperElement.append(bookForText);

            // Filter unbookedPets based on petKeeper's capability
            let filteredPets = unbookedPets.filter(pet => {
                if (petKeeper.catkeeper && petKeeper.dogkeeper) return true; // If keeper can keep both
                else if (petKeeper.catkeeper && pet.type === 'cat') return true; // If keeper can keep cats and pet is a cat
                else if (petKeeper.dogkeeper && pet.type === 'dog') return true; // If keeper can keep dogs and pet is a dog
                return false; // Otherwise, do not include pet
            });

            // Create buttons for each filtered pet
            filteredPets.forEach(function (pet) {
                var bookButton = $('<button>' + pet.name + '</button>');
                bookButton.click(function(e) {
                    e.stopPropagation(); // Prevent the petKeeperElement click event from firing
                    console.log('Booking for pet:', pet.name, 'with keeper:', petKeeper.username);
                    makeBooking(petKeeper, pet); // Adjust makeBooking to handle pet parameter
                });
                petKeeperElement.append(bookButton);
            });

            petKeepersList.append(petKeeperElement);
        });
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}
/**
 * form to accomplish the booking
 * @param {*} petKeeper 
 */
function makeBooking(petKeeper, pet) {
    // Create the form
    var form = $('<form id="form"></form>');
    form.append('<label for="price">Price:</label><br>');
    form.append('<input type="text" id="price" name="price" value="' + petKeeper.dogprice + '" readonly><br>'); // You'll need to set the price
    form.append('<label for="from">From:</label><br>');
    form.append('<input type="date" id="fromDate" name="fromDate"><br>');
    form.append('<label for="to">To:</label><br>');
    form.append('<input type="date" id="toDate" name="toDate"><br>');
    form.append('<input type="submit" value="Submit">');

    // Add the form to the page
    $('#formBook').append(form);

    // Add an event listener to the form
    form.on('submit', function(e) {
        e.preventDefault(); // Prevent the form from being submitted normally

        // Prepare data for sending
        var formData = new FormData(form[0]);
        var data = {};
        formData.forEach((value, key) => {
            if (key === 'price') {
                data[key] = parseInt(value, 10); // Cast price to integer
            } else {
                data[key] = value; // Treat pet_id and other fields as characters
            }
        });
        data.owner_id = GlobalOwnerId;
        data.keeper_id = petKeeper.keeper_id;
        data.status = "requested"
        data.pet_id = pet.pet_id.toString(); // Ensure pet_id is treated as a character
        console.log(data);

        // Make the AJAX request
        $.ajax({
            url: 'booking?',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                console.log('Booking successful:', response);
            },
            error: function(error) {
                console.error('Error making booking:', error);
            }
        });
    });
}



/**
 * return the available petKeepers based on the petOwner's pet type     (?)  split for messages
 * @param {*} type 
 */

function getPetKeepers(type) {
    $.ajax({
        url: 'GetAllPetKeepers?',
        type: 'GET',
        data: {
            type: type
        },
        dataType: 'json',
        success: function (data) {
            GetPetsWithNoBooking();
            setTimeout(function() {
                displayPetKeepers(data, type);
                displayMessage(data);
            }, 200); // Wait before proceeding


        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}
let unbookedPets = [];
function GetPetsWithNoBooking() {
    console.log("Attempting to retrieve pets with no booking for owner ID:", GlobalOwnerId);

    $.ajax({
        url: 'booking?',
        type: 'GET',
        data: {
            owner_id: GlobalOwnerId
        },
        success: function(bookingData) {
            // const bookedPetIds = bookingData.map(booking => booking.pet_id);
            getPetsList(GlobalOwnerId).then(ownerPets => {
                if (Array.isArray(ownerPets)) {
                    // const ownerPetIds = ownerPets.map(pet => pet.pet_id);
                    const unbookedPetIds = ownerPets.filter(id => !bookingData.includes(id));
                    unbookedPets = unbookedPetIds;
                    console.log('Unbooked Pet IDs:', unbookedPetIds);
                } else {
                    console.error('Expected an array of pets, but got:', ownerPets);
                }
            }).catch(error => {
                console.error('Error fetching pets:', error);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching booking data:', {xhr: xhr, status: status, error: error});
        }
    });
}

function getPetsList(GlobalOwnerId) {
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

                    // Save the pets data into the global array
                    petsArray = data;
                    resolve(data); // Resolve the Promise with the type value
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

function getKeeperIdsFromBookings() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'bookingIds',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(error) {
                console.error('Error fetching keeper IDs:', error);
                reject(error);
            }
        });
    });
}

function fetchPetKeepers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'GetAllAllPetKeepers?',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Received pet keepers:', data);
                resolve(data);
            },
            error: function(error) {
                console.error('Error fetching pet keepers:', error);
                reject(error);
            }
        });
    });

}

//TODO get petkeeper from booking

function displayMessage() {

    fetchPetKeepers().then(petKeepers => {
        getKeeperIdsFromBookings().then(keeperIdsFromBookings => {
            console.log("petKeepers: " + JSON.stringify(petKeepers, null, 2));
            let petKeepersList = $('#users_message');
            petKeepersList.empty();
            console.log("owner id"+GlobalOwnerId)
            console.log(keeperIdsFromBookings); // Debugging: prints the keeperIdsFromBookings array
            const relevantKeeperIds = keeperIdsFromBookings.filter(booking => booking.owner_id === GlobalOwnerId).map(booking => booking.keeper_id);
            console.log(relevantKeeperIds); // Debugging: prints the relevantKeeperIds array
            const filteredPetKeepers = petKeepers.filter(petKeeper => relevantKeeperIds.includes(petKeeper.keeper_id));
            console.log(filteredPetKeepers); // Debugging: prints the filteredPetKeepers array
            if (filteredPetKeepers && filteredPetKeepers.length > 0) {
                filteredPetKeepers.forEach(function(petKeeper) {
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
                petKeepersList.append('<p>No pet keepers found in bookings.</p>');
            }
        }).catch(error => {
            console.error('Error fetching keeper IDs from bookings:', error);
        });
    }).catch(error => {
        console.error('Error fetching pet keepers:', error);
    });
}
/**
 * Change the user info on the server
 * @constructor
 */
function ChangeUserInfo() {
    const formElement = document.getElementById('changeInfo');

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.getResponseHeader('Content-Type') === 'application/json') {
                    const responseData = JSON.parse(xhr.responseText);
                    console.log('Response:', responseData);
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

