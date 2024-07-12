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

// Function to display pet keepers
// function displayPetKeepers(petKeepers) {
//     var petKeepersList = $('#context');
//     petKeepersList.empty();
//
//     if (petKeepers && petKeepers.length > 0) {
//
//         let tableHTML = `<table id="table">
//                         <tr class="text">
//                             <th>First Name</th>
//                             <th>Last Name</th>
//                         </tr>`;
//
//
//         // Loop through each pet keeper and display their details
//         petKeepers.forEach(function (petKeeper) {
//             tableHTML += '<tr class="text">' +
//                     '<td> ' + petKeeper.firstname + '</td>' +
//                     '<td> ' + petKeeper.lastname + '</td>' +
//                     '</tr>';
//         });
//
//         tableHTML += ('</table>');
//         petKeepersList.append(tableHTML);
//     } else {
//         petKeepersList.append('<p>No pet keepers found.</p>');
//     }
// }

