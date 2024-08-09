//TODO after book is finished leave a review
let params = new URLSearchParams(window.location.search);
const GlobalUsername = params.get('username');
let GlobalOwnerId ;
let petKeeperUsername;
console.log("username :" + GlobalUsername);

retrieveData();


/**
 * asynchronous call on getting pet owner's id thus call made again
 * retrieves pet owner's id
 * retrieves pet owner's registered pets
 * gets pets' type
 * retrieves available pet keepers according to pets' type
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
document.addEventListener('DOMContentLoaded', function (){
    const msg_cont = document.getElementById('msg_cont');
    const users_message = document.getElementById('users_message');
    const back = document.getElementById('back');

    back.addEventListener('click', function() {
        users_message.style.display = 'block';
        msg_cont.style.display = 'none';
    });
})


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

// Declare a global array to store pets
let petsArray = [];

/**
 * this function returns the pets that belongs to the petOwner
 * @param GlobalOwnerId is the owner_id
 * @returns {Promise<unknown>} an array with the pets
 */
function getPets(GlobalOwnerId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'GetPostPets?',
            type: 'GET',
            data: {
                owner_id: GlobalOwnerId
            },
            success: function (data) {
                const ajaxContent = $('#pets');
                if (data.length > 0) {
                    ajaxContent.html(displayPets(data));
                    let type = seePetType(data);
                    petsArray = data;
                    resolve(type);
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

/**
 * returns the type of pets that petOwner has registered
 * @param pets an array with the pets
 * @returns {string} "all", "catKeepers" or "dogKeepers"
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

/**
 * displays the pet keepers that are available for the petOwner
 * @param petKeepers
 */
function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#booking_context');

    petKeepersList.empty();
    console.log(petKeepers);
    console.log(unbookedPets);
    if (petKeepers && petKeepers.length > 0) {
        petKeepers.forEach(function (petKeeper) {
            var petKeeperElement = $('<div class="person">' + petKeeper.firstname + ' ' + petKeeper.lastname + '<br>' + petKeeper.city + ' ' + petKeeper.address + '<br>' + petKeeper.telephone + '<br>' + petKeeper.propertydescription +'<br>' +'</div>');
            var bookForText = $('<span>Book for: </span>');
            petKeeperElement.append(bookForText);

            let filteredPets = unbookedPets.filter(pet => {
                if (petKeeper.catkeeper && petKeeper.dogkeeper) return true; // If keeper can keep both
                else if (petKeeper.catkeeper && pet.type === 'cat') return true;
                else if (petKeeper.dogkeeper && pet.type === 'dog') return true;
                return false;
            });

            filteredPets.forEach(function (pet) {
                var bookButton = $('<button>' + pet.name + '</button>');
                bookButton.click(function(e) {
                    e.stopPropagation();
                    console.log('Booking for pet:', pet.name, 'with keeper:', petKeeper.username);
                    makeBooking(petKeeper, pet);
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
    var form = $('<form id="form"></form>');

    // Append PetKeeper and Pet Name
    form.append('<div>PetKeeper: ' + petKeeper.firstname + ' ' + petKeeper.lastname + '</div>');
    form.append('<div>Pet: ' + pet.name + '</div>');

    form.append('<label for="priceDay">Price per day:</label><br>');
    form.append('<input type="text" id="priceDay" name="priceDay" readonly><br>');
    form.append('<label for="from">From:</label>');
    form.append('<input type="date" id="fromDate" name="fromDate">');
    form.append('<label for="to">To:</label>');
    form.append('<input type="date" id="toDate" name="toDate"><br>');
    form.append('<label for="price">Total price:</label><br>');
    form.append('<input type="text" id="price" name="price" readonly><br>');
    form.append('<input type="submit" value="Submit">');

    $('#formBook').append(form);

    $('#priceDay').val(pet.type ==='dog' ? petKeeper.dogprice : petKeeper.catprice);

    // Event listener to calculate duration and price
    form.on('change', '#toDate, #fromDate', function() {
        var fromDate = new Date($('#fromDate').val());
        var toDate = new Date($('#toDate').val());
        if (fromDate && toDate && toDate > fromDate) {
            var duration = (toDate - fromDate) / (1000 * 60 * 60 * 24);
            var pricePerDay = pet.type === 'dog' ? petKeeper.dogprice : petKeeper.catprice;
            var totalPrice = duration * pricePerDay;
            $('#price').val(totalPrice);
        } else {
            $('#price').val('');
        }
    });

    form.on('submit', function(e) {
        e.preventDefault();

        var formData = new FormData(form[0]);
        var data = {};
        formData.forEach((value, key) => {
            if (key === 'price') {
                data[key] = parseInt(value, 10);
            } else {
                data[key] = value;
            }
        });
        data.owner_id = GlobalOwnerId;
        data.keeper_id = petKeeper.keeper_id;
        data.status = "requested";
        data.pet_id = pet.pet_id.toString();
        console.log(data);

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

function displayBookedPetKeepers() {
    fetchPetKeepers().then(petKeepers => {
        getBookings().then(bookings => {
            let bookedPetKeepersList = $('#booked_context');
            bookedPetKeepersList.empty();

            const relevantBookings = bookings.filter(booking => booking.owner_id === GlobalOwnerId);
            const relevantKeeperIds = relevantBookings.map(booking => booking.keeper_id);
            const filteredPetKeepers = petKeepers.filter(petKeeper => relevantKeeperIds.includes(petKeeper.keeper_id));

            if (filteredPetKeepers && filteredPetKeepers.length > 0) {
                filteredPetKeepers.forEach(function(petKeeper) {
                    var petKeeperElement = $('<div class="person">' + petKeeper.firstname + ' ' + petKeeper.lastname + '<br>' + petKeeper.city + ' ' + petKeeper.address + '<br>' + petKeeper.telephone + '<br>' + petKeeper.propertydescription + '<br>' + '</div>');
                    bookedPetKeepersList.append(petKeeperElement);
                });
            } else {
                bookedPetKeepersList.append('<p>No pet keepers found in bookings.</p>');
            }
        }).catch(error => {
            console.error('Error fetching bookings:', error);
        });
    }).catch(error => {
        console.error('Error fetching pet keepers:', error);
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
                displayPetKeepers(data);
                displayBookedPetKeepers();
                displayMessage(data);
            }, 200);

        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}
let unbookedPets = [];

/**
 * Get pets with no booking
 * @constructor
 */
function GetPetsWithNoBooking() {
    console.log("Attempting to retrieve pets with no booking for owner ID:", GlobalOwnerId);

    $.ajax({
        url: 'booking?',
        type: 'GET',
        data: {
            owner_id: GlobalOwnerId
        },
        success: function(bookingData) {
            getPetsList(GlobalOwnerId).then(ownerPets => {
                if (Array.isArray(ownerPets)) {
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

/**
 * Get the pets list for the given owner ID
 * @param GlobalOwnerId
 * @returns {Promise<unknown>}
 */
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

                    petsArray = data;
                    resolve(data);
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

/**
 * Get the bookings from the server
 * @returns {Promise<unknown>}
 */
function getBookings() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'bookingIds',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data)
                resolve(data);
            },
            error: function(error) {
                console.error('Error fetching keeper IDs:', error);
                reject(error);
            }
        });
    });
}

/**
 * Fetch the pet keepers from the server
 * @returns {Promise<unknown>}
 */
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

/**
 * Display the messages between the pet owner and the pet keeper
 * @param petKeeper
 * @param bookings
 */
function userMessage(petKeeper, bookings) {
    const msg_cont = document.getElementById('msg_cont');
    const users_message = document.getElementById('users_message');
    msg_cont.style.display = 'block';
    users_message.style.display = 'none';
    let msg = $('#messages');
    msg.empty();
    msg.append('<h2>' + petKeeper.username + '</h2>' + '<br>');
    const booking_id = bookings.filter(booking => booking.keeper_id === petKeeper.keeper_id).map(booking => booking.booking_id);
    getMessages(booking_id).then(messages => {
        if (messages && messages.length > 0) {
            messages.forEach(function(message) {
                var messageElement = $('<div class="message">From: ' + message.sender + '<br>' + message.message + '</div>');
                msg.append(messageElement);
            });
        } else {
            msg.append('<p>No messages found.</p>');
        }
    }).catch(error => {
        console.error('Error fetching messages:', error);
    });

    document.getElementById('sendButton').addEventListener('click', function() {
        const textArea = document.getElementById('text_area');
        const messageContent = textArea.value.trim();
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        if (messageContent) {
            const data = {
                booking_id: booking_id[0],
                message: messageContent,
                sender: GlobalUsername,
                datetime: `${date} ${time}`,
            };

            $.ajax({
                url: 'GetPostMessages',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(response) {
                    console.log('Message sent successfully:', response);
                    textArea.value = '';

                    const messageElement = $('<div class="message">From: ' + data.sender + '<br>' + data.message + '</div>');
                    $('#messages').append(messageElement);
                },
                error: function(xhr, status, error) {
                    console.error('Error sending message:', {
                        readyState: xhr.readyState,
                        status: xhr.status,
                        responseText: xhr.responseText,
                        statusText: xhr.statusText,
                        error: error
                    });
                }
            });
        } else {
            console.log('Message content is empty.');
        }
    });
}

/**
 * Get the messages from the server
 * @param bookingId
 * @returns {Promise<unknown>}
 */
function getMessages(bookingId) {
    console.log(bookingId);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'GetPostMessages',
            type: 'GET',
            data: {
                booking_id: bookingId[0]
            },
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error);
            }
        });
    });
}

/**
 * Display the contacts that pet owner has with the pet keepers
 */
function displayMessage() {
    fetchPetKeepers().then(petKeepers => {
        getBookings().then(bookings => {
            let petKeepersList = $('#users_message');
            petKeepersList.empty();
            const relevantKeeperIds = bookings.filter(booking => booking.owner_id === GlobalOwnerId).map(booking => booking.keeper_id);
            const filteredPetKeepers = petKeepers.filter(petKeeper => relevantKeeperIds.includes(petKeeper.keeper_id));
            if (filteredPetKeepers && filteredPetKeepers.length > 0) {
                filteredPetKeepers.forEach(function(petKeeper) {
                    var petKeeperElement = $('<div class="person"> Name ' + petKeeper.firstname + ' ' + petKeeper.lastname + '</div>');

                    petKeeperElement.click(function() {
                        userMessage(petKeeper, bookings);
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

    const formData = new FormData(formElement);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    getOwnerId(GlobalUsername).then(ownerId => {
        console.log('Owner ID:', ownerId);
        data.pet_id = String(ownerId) + String(data.birthyear);
        data.owner_id = ownerId;
        console.log(data);
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
                const responseData = JSON.parse(response);
                console.log('Received response:', responseData); // Log the parsed response
                    if (responseData.ownerId) {
                    console.log('Owner ID:', responseData.ownerId);
                    resolve(responseData.ownerId);
                } else {
                    console.error('Owner ID not found in response');
                    reject('Owner ID not found in response');
                }
            },
            error: function(error) {
                console.error('Error:', error);
                reject(error);
            }
        });
    });
}

