var context = document.getElementById("context");

document.getElementById('petKeepers').addEventListener('click', doPetKeepers);
document.getElementById('petOwners').addEventListener('click', doPetOwners);
document.getElementById('profit').addEventListener('click', doProfits);
document.getElementById('pets').addEventListener('click', doPets);
document.getElementById('users').addEventListener('click', doUsers);

function doPetKeepers() {
    getAllKeepers();
}

function doPetOwners() {
    getAllOwners();
}

function doProfits() {
    getAllProfits();
}

function doPets() {
    getAllPets();
}

function doUsers() {
    getAllUsers();
}

function getAllUsers() {
    $.ajax({
        url: 'GetAllAllPetKeepers',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $.ajax({
               url: 'GetAllPetOwners',
                type: 'GET',
                dataType: 'json',
                success: function (data2) {
                    displayUsers(data.concat(data2));
                    displayUserCounts(data.length, data2.length);
                    displayUserChart(data, data2);

                },
            });
        },
    });
}

function displayUsers(data) {
    let context = document.getElementById('context');
    context.innerHTML = '';

    if (data && data.length > 0) {
        let tableHTML = `<div style="display: flex;">
                            <div style="flex: 1;">
                                <table id="table">
                                    <tr class="text">
                                        <th>Username</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                    </tr>`;

        data.forEach(function (item) {
            tableHTML += `<tr class="text">
                            <td>${item.username}</td>
                            <td>${item.firstname}</td>
                            <td>${item.lastname}</td>
                          </tr>`;
        });

        tableHTML += `</table>
                    </div>
                    <div id="chartContainer" style="flex: 1;">
                        <canvas id="userChart"></canvas>
                    </div>
                </div>`;
        context.innerHTML = tableHTML;
    } else {
        context.innerHTML = '<p>No data found.</p>';
    }
}

function displayUserCounts(keeperCount, ownerCount) {
    let context = document.getElementById('context');
    let countsHTML = `<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>Pet Keepers: ${keeperCount}</div>
                        <div>Pet Owners: ${ownerCount}</div>
                      </div>`;
    context.insertAdjacentHTML('afterbegin', countsHTML);
}

function displayUserChart(petKeepers, petOwners) {
    var ctx = document.getElementById('userChart').getContext('2d');

    var keeperCount = petKeepers.length;
    var ownerCount = petOwners.length;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pet Keepers', 'Pet Owners'],
            datasets: [{
                data: [keeperCount, ownerCount],
                backgroundColor: ['#FF6384', '#36A2EB'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'User Distribution'
                }
            }
        }
    });
}

function getAllPets() {
    $.ajax({
        url: 'getAllPets',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayPets(data);
        },
    });
}

function displayPets(data) {
    var context = document.getElementById('context');
    context.innerHTML = '';

    var cats = data.filter(pet => pet.type === 'cat');
    var dogs = data.filter(pet => pet.type === 'dog');

    var catCount = cats.length;
    var dogCount = dogs.length;

    let tableHTML = `<h3>Cats (${catCount})</h3>`;
    tableHTML += `<table id="table">
                    <tr class="text">
                        <th>Pet ID</th>
                        <th>Name</th>
                        <th>Breed</th>
                        <th>Age</th>
                        <th>Weight</th>
                    </tr>`;

    cats.forEach(function (item) {
        tableHTML += `<tr class="text">
                        <td>${item.pet_id}</td>
                        <td>${item.name}</td>
                        <td>${item.breed}</td>
                        <td>${2024 - item.birthyear}</td>
                        <td>${item.weight}</td>
                        <td><img src="${item.photo}" alt="${item.name}" width="100"></td>

                      </tr>`;
    });

    tableHTML += '</table>';

    tableHTML += `<h3>Dogs (${dogCount})</h3>`;
    tableHTML += `<table id="table">
                    <tr class="text">
                        <th>Pet ID</th>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Age</th>
                        <th>Owner</th>
                    </tr>`;

    dogs.forEach(function (item) {
        tableHTML += `<tr class="text">
                        <td>${item.pet_id}</td>
                        <td>${item.name}</td>
                        <td>${item.breed}</td>
                        <td>${2024 - item.birthyear}</td>
                        <td>${item.weight}</td>
                        <td><img src="${item.photo}" alt="${item.name}" width="100"></td>

                      </tr>`;
    });

    tableHTML += '</table>';

    context.innerHTML = tableHTML;
}

function getAllProfits(){
    $.ajax({
        url: 'bookingIds',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayProfits(data);
        },
    })
}

function displayProfits(data){
    var context = document.getElementById('context');
    context.innerHTML = '';
    let profit = 0;
    if (data && data.length > 0) {

        let tableHTML = `<table id="table">
                            <tr class="text">
                                <th>Booking ID</th>
                                <th>Price</th>
                            </tr>`;

        data.forEach(function (item) {
            profit += item.price *0.15;
            tableHTML += `<tr class="text">
                            <td>${item.booking_id}</td>
                            <td>${item.price}</td>
                          </tr>`;
        });
        tableHTML += `<tr class="text"><td>Total profit: ${profit}</td></tr>`
        tableHTML += '</table>';
        context.innerHTML = tableHTML;
    } else {
        context.innerHTML = '<p>No data found.</p>';
    }
}


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

function displayData(data) {
    var context = document.getElementById('context');
    context.innerHTML = '';

    if (data && data.length > 0) {
        let tableHTML = `<table id="table">
                            <tr class="text">
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Action</th>
                            </tr>`;

        data.forEach(function (item) {
            tableHTML += `<tr class="text">
                            <td>${item.username}</td>
                            <td>${item.firstname}</td>
                            <td><button onclick='deleteUser(this, ${JSON.stringify(item)})'>Delete</button></td>
                          </tr>`;
        });

        tableHTML += '</table>';
        context.innerHTML = tableHTML;
    } else {
        context.innerHTML = '<p>No data found.</p>';
    }
}

function deleteUser(button, user) {
    const url = user.keeper_id ? 'DeletePetKeeper' : 'DeletePetOwner';
    const username = user.username;
    $.ajax({
        url: url,
        data: {
            username: username
        },
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            const row = button.parentNode.parentNode;
            row.parentNode.removeChild(row);
        },
        error: function (error) {
            console.error('Error deleting user:', error);
            console.error('Error details:', {
                readyState: error.readyState,
                status: error.status,
                statusText: error.statusText,
                responseText: error.responseText
            });
        }
    });
}


function getAllKeepers() {
    $.ajax({
        url: 'GetAllAllPetKeepers?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            displayData(data)
        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}

// Function to display pet keepers
function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#context');
    petKeepersList.empty();

    if (petKeepers && petKeepers.length > 0) {

        let tableHTML = `<table id="table">
                        <tr class="text">
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>`;


        petKeepers.forEach(function (petKeeper) {
            tableHTML += '<tr class="text">' +
                    '<td> ' + petKeeper.firstname + '</td>' +
                    '<td> ' + petKeeper.lastname + '</td>' +
                    '</tr>';
        });

        tableHTML += ('</table>');
        petKeepersList.append(tableHTML);
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}


function getAllOwners() {
    $.ajax({
        url: 'GetAllPetOwners?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            displayData(data)
        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}

// Function to display pet keepers
function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#context');
    petKeepersList.empty();

    if (petKeepers && petKeepers.length > 0) {

        let tableHTML = `<table id="table">
                        <tr class="text">
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>`;


        petKeepers.forEach(function (petKeeper) {
            tableHTML += '<tr class="text">' +
                    '<td> ' + petKeeper.firstname + '</td>' +
                    '<td> ' + petKeeper.lastname + '</td>' +
                    '</tr>';
        });

        tableHTML += ('</table>');
        petKeepersList.append(tableHTML);
    } else {
        petKeepersList.append('<p>No pet keepers found.</p>');
    }
}
