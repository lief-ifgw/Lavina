var radioRest = document.getElementById("rest");
var radioMoveTogether = document.getElementById("move_together");
var radioMoveSeparately = document.getElementById("move_separately");

function isAnswered() {
    if (radioMoveTogether.checked === true ||
        radioMoveSeparately.checked === true ||
        radioRest.checked === true) {
        return true;
    }
}

function mustAnswer() {
    alert("Você deve marcar uma opção antes de iniciar a simulação.");
}

