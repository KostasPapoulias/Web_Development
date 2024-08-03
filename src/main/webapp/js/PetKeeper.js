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
        fetchAndDisplayPetKeepers();

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

// Function to retrieve and display pet keepers
function fetchAndDisplayPetKeepers() {
    $.ajax({
        url: 'GetAllAllPetKeepers',
        type: 'GET',
        success: function(data) {
            const petKeepers = data;
            const petKeeperContainer = document.getElementById('users_message');
            petKeeperContainer.innerHTML = '';
            petKeeperContainer.innerHTML = '<p>Pet Keepers</p>';

            petKeepers.forEach(petKeeper => {
                const petKeeperElement = document.createElement('div');

                if (petKeeper.username !== Username) {

                    petKeeperElement.innerHTML += `
                        <p>Pet Keeper ID: ${petKeeper.keeper_id}</p>
                        <p>Name: ${petKeeper.username}</p>
                        <hr>
                    `;
                }
                petKeeperElement.onclick = () => handlePetKeeperClick(petKeeper.username);

                petKeeperContainer.appendChild(petKeeperElement);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error: ' + xhr.responseText);
            const petKeeperContainer = document.getElementById('petKeeperContainer');
            petKeeperContainer.innerHTML = '<p style="color:red">Error fetching pet keepers.</p>';
        }
    });
}

function handlePetKeeperClick(username) {
    document.getElementById('users_message').style.display = 'none';
    document.getElementById('msg_cont').style.display = 'block';
    document.getElementById('msg_cont').innerHTML += `
        <p>Send a message to ${username}</p>      
    `;
}




