document.getElementById("takecarecat").addEventListener('click', printCareCat);
document.getElementById("takecaredog").addEventListener('click', printCareDog);
document.getElementById("askButton").addEventListener('click', AskQuestion);

function printCareCat() {

    document.getElementById("context").style.backgroundColor = 'bisque';
    document.getElementById("context").style.border = " 2px solid black";
    document.getElementById("context").innerHTML = "proccesing...";
    printAnswer("How to take care of a cat");

}

function printCareDog() {

    document.getElementById("context").style.backgroundColor = 'bisque';
    document.getElementById("context").style.border = " 2px solid black";
    document.getElementById("context").innerHTML = "proccesing...";
    printAnswer("How to take care of a dog");

}

function AskQuestion() {
    var quest = document.getElementById("askid").value;
    document.getElementById("context").style.backgroundColor = 'bisque';
    document.getElementById("context").style.border = " 2px solid black";
    document.getElementById("context").innerHTML = "proccesing...";
    printAnswer(quest);

}

function printAnswer(question) {
    fetch('ChatGPTAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: question
    })
            .then(response => response.text())
            .then(processedString => {
                document.getElementById("context").innerHTML = processedString;
            })
            .catch(error => console.error('Error:', error));
}


