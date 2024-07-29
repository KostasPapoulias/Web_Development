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

    });
};
setTimeout(function() {
    console.log(KeeperId)
    //CONTROLLER


















}, 100)

document.getElementById('submit').addEventListener('click', function() {
    const formElement = document.getElementById('changeInfo');

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        const ajaxContent = $('#change_info_container');
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                ajaxContent.html("Successful Info Change. <br> Your Data");
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

    data.username = Username;
    console.log(data);
    xhr.open('POST', 'PetKeeper?');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));

});

function updatePriceFields() {
    let keeperType = document.querySelector('input[name="keeperType"]:checked') ? document.querySelector('input[name="keeperType"]:checked').value : null;
    const catPriceContainer = document.getElementById('catpriceContainer');
    const dogPriceContainer = document.getElementById('dogpriceContainer');

    if (keeperType === 'dog') {
        catPriceContainer.style.display = 'none';
        dogPriceContainer.style.display = 'block';
    } else if (keeperType === 'cat') {
        catPriceContainer.style.display = 'block';
        dogPriceContainer.style.display = 'none';
    } else if (keeperType === 'both') {
        catPriceContainer.style.display = 'block';
        dogPriceContainer.style.display = 'block';
    }
}

document.getElementById('dogKeeper').addEventListener('change', updatePriceFields);
document.getElementById('catKeeper').addEventListener('change', updatePriceFields);
document.getElementById('bothKeeper').addEventListener('change', updatePriceFields);

updatePriceFields();