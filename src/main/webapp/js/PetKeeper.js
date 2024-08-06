console.log("PetKeeper.js is loaded");
let params = new URLSearchParams(window.location.search);
let KeeperId;
let Username = params.get('username');

window.onload = function() {
    console.log("Window loaded");

    if (!Username) {
        console.error("Username parameter is missing in the URL");
        return;
    }

    console.log("username: " + Username);

    function getKeeperId(Username, callback) {
        console.log("Making AJAX request with username: " + Username);
        $.ajax({
            url: 'PetKeeper?',
            type: 'GET',
            data: {
                username: Username
            },
            success: function(data) {
                console.log("AJAX request successful");
                KeeperId = data.keeper_id;
                console.log("KeeperId: " + KeeperId);
                callback(KeeperId);
            },
            error: function(xhr, status, error) {
                console.error('Error: ' + xhr.responseText);
            }
        });
    }

    getKeeperId(Username, function(KeeperId) {
        console.log("KeeperId is now available: " + KeeperId);
        fetchAndDisplayBookings(KeeperId);
        displayMessage();

    });

    function updatePriceFields() {
        let keeperType = document.querySelector('input[name="keeperType"]:checked') ? document.querySelector('input[name="keeperType"]:checked').value : null;
        const catPriceContainer = document.getElementById('catpriceContainer');
        const dogPriceContainer = document.getElementById('dogpriceContainer');

        if (keeperType === 'dog') {
            catPriceContainer.style.display = 'none';
            dogPriceContainer.style.display = 'block';
            document.getElementById('catkeeper').value = 'false';
            document.getElementById('dogkeeper').value = 'true';
        } else if (keeperType === 'cat') {
            catPriceContainer.style.display = 'block';
            dogPriceContainer.style.display = 'none';
            document.getElementById('catkeeper').value = 'true';
            document.getElementById('dogkeeper').value = 'false';
        } else if (keeperType === 'both') {
            catPriceContainer.style.display = 'block';
            dogPriceContainer.style.display = 'block';
            document.getElementById('catkeeper').value = 'true';
            document.getElementById('dogkeeper').value = 'true';
        }

    }

    // Add event listeners to radio buttons
    const dogKeeperRadio = document.getElementById('dogkeeper');
    const catKeeperRadio = document.getElementById('catkeeper');
    const bothKeeperRadio = document.getElementById('bothKeeper');

    if (dogKeeperRadio && catKeeperRadio && bothKeeperRadio) {
        dogKeeperRadio.addEventListener('change', updatePriceFields);
        catKeeperRadio.addEventListener('change', updatePriceFields);
        bothKeeperRadio.addEventListener('change', updatePriceFields);
    } else {
        console.error("One or more radio buttons are missing");
    }

    // Initial call to set the correct visibility
    updatePriceFields();


    document.getElementById('back').addEventListener('click', function() {
        console.log('Back button clicked');
        document.getElementById('users_message').style.display = 'block';
        document.getElementById('msg_cont').style.display = 'none';
    });
};

//      CHANGE INFO NOT SUCCESS, SUSPECT ISSUE RELATED TO FALSE REGISTRATION

function ChangeUserInfo(){

    const formElement = document.getElementById('changeInfo');

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        const ajaxContent = $('#change_info_container');
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                ajaxContent.html("Successful Info Change. <br> Your Data");
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

    const keeperType = data.keeperType;
    if (keeperType === 'dog') {
        data.catkeeper = 'false';
        data.dogkeeper = 'true';
    } else if (keeperType === 'cat') {
        data.catkeeper = 'true';
        data.dogkeeper = 'false';
    } else if (keeperType === 'both') {
        data.catkeeper = 'true';
        data.dogkeeper = 'true';
    } else {
        data.catkeeper = '';
        data.dogkeeper = '';
    }
    data.catprice = data.catprice ? parseFloat(data.catprice) : null;
    data.dogprice = data.dogprice ? parseFloat(data.dogprice) : null;

    data.username = Username;
    console.log(data);
    xhr.open('POST', 'PetKeeper?');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}
// DOESN'T APPEAR FROM AND TO DATE???
function fetchAndDisplayBookings(KeeperId) {
    console.log(KeeperId);
    $.ajax({
        url: 'bookingIds',
        type: 'GET',
        success: function(data) {
            console.log(data);
            const bookings = data;
            const filteredBookings = bookings.filter(booking => booking.keeper_id === KeeperId);
            const bookingContext = document.getElementById('booking_context');
            bookingContext.innerHTML = '';

            if (filteredBookings.length > 0) {
                filteredBookings.forEach(booking => {
                    const bookingElement = document.createElement('div');
                    bookingElement.innerHTML = `
                        <p>Booking ID: ${booking.booking_id}</p>
                        <p>Keeper ID: ${booking.keeper_id}</p>
                        <p>Booking Date: ${booking.fromdate} - ${booking.todate}</p>
                        <p>Booking Status: ${booking.status}</p>
                        ${booking.status === 'requested' ? `
                            <button onclick="handleAccept(${booking.booking_id})">Accept</button>
                            <button onclick="handleReject(${booking.booking_id})">Reject</button>
                        ` : ''}
                        <hr>
                    `;
                    bookingContext.appendChild(bookingElement);
                });
            } else {
                bookingContext.innerHTML = '<p>No bookings found for this keeper.</p>';
            }
        },
        error: function(xhr, status, error) {
            console.error('Error: ' + xhr.responseText);
            const bookingContext = document.getElementById('booking_context');
            bookingContext.innerHTML = '<p style="color:red">Error fetching bookings.</p>';
        }
    });
}

function handleAccept(bookingId) {
    updateBookingStatus(bookingId, 'accepted');
}

function handleReject(bookingId) {
    updateBookingStatus(bookingId, 'rejected');
}

function updateBookingStatus(bookingId, status) {
    console.log(bookingId + status);
    $.ajax({
        url: 'UpdateBookingStatus',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            booking_id: bookingId,
            status: status
        },
        success: function(response) {
            console.log('Booking status updated successfully');
            fetchAndDisplayBookings(KeeperId);
        },
        error: function(xhr, status, error) {
            console.error('Error: ' + xhr.responseText);
        }
    });
}

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
 * Display the contacts that pet owner has with the pet owners
 */
function displayMessage() {
    fetchPetOwners().then(petOwners => {
        getBookings().then(bookings => {
            let petOwnersList = $('#users_message');
            petOwnersList.empty();
            console.log(petOwners);
            const relevantOwnerIds = bookings.filter(booking => booking.keeper_id === KeeperId).map(booking => booking.owner_id);
            const filteredPetOwners = petOwners.filter(petOwner => relevantOwnerIds.includes(petOwner.owner_id));
            if (filteredPetOwners && filteredPetOwners.length > 0) {
                filteredPetOwners.forEach(function(petOwner) {
                    let petOwnerElement = $('<div class="person"> Name ' + petOwner.firstname + ' ' + petOwner.lastname + '</div>');

                    petOwnerElement.click(function() {
                        userMessage(petOwner, bookings);
                    });
                    petOwnersList.append(petOwnerElement);
                });
            } else {
                petOwnersList.append('<p>No pet owners found in bookings.</p>');
            }
        }).catch(error => {
            console.error('Error fetching owner IDs from bookings:', error);
        });
    }).catch(error => {
        console.error('Error fetching pet owners:', error);
    });
}
/**
 * Fetch the pet owners from the server
 * @returns {Promise<unknown>}
 */
function fetchPetOwners() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'GetAllPetOwners?',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Received pet owners:', data);
                resolve(data);
            },
            error: function(error) {
                console.error('Error fetching pet owners:', error);
                reject(error);
            }
        });
    });
}
// Function to retrieve and display pet owners
function userMessage(petOwner, bookings) {
    const msg_cont = document.getElementById('msg_cont');
    const users_message = document.getElementById('users_message');
    msg_cont.style.display = 'block';
    users_message.style.display = 'none';
    let msg = $('#messages');
    msg.empty();
    msg.append('<h2>' + petOwner.username + '</h2>' + '<br>');
    const booking_id = bookings.filter(booking => booking.owner_id === petOwner.owner_id).map(booking => booking.booking_id);
    getMessages(booking_id).then(messages => {
        if (messages && messages.length > 0) {
            messages.forEach(function(message) {
                let messageElement = $('<div class="message">From: ' + message.sender + '<br>' + message.message + '</div>');
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
                sender: Username,
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
 * Get the messages from the database
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

