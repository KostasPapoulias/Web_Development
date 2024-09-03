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
    $.ajax({
        url: 'GetAllPetKeepers?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayPetKeepers(data);
        },
        error: function (error) {
            console.error('Error fetching pet keepers:', error);
        }
    });
}

// Function to display pet keepers
function displayPetKeepers(petKeepers) {
    var petKeepersList = $('#petkeepersDiv');
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

window.onload = function () {
    getAllKeepers();
};
