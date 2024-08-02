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

