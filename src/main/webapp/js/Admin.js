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

}

function doPets() {

}

function doUsers() {

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


        // Loop through each pet keeper and display their details
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
    // Make an AJAX request to fetch pet keepers
    $.ajax({
        url: 'GetAllPetOwners?', // Replace with the actual URL to your servlet
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


        // Loop through each pet keeper and display their details
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
