const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

var gameState = {
    user: "",
    wins: 0,
    losses: 0,
    remainingTries: 12,
    currentWord: "",
    currentWordLetters: []
}

var toTitleCase = function (str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

var setup = function () {
    fetch('http://api.wordnik.com/v4/words.json/randomWord?api_key=uzuceirqshtna9m74vpps369l8w6ro1pspd2zvrw8the4welt')
        .then(response => response.json())
        .then(function (data) {
            gameState.currentWord = data.word

            for (var i = 0; i < gameState.currentWord.length; i++) {
                gameState.currentWordLetters.push(gameState.currentWord.charAt(i));
                var guessWord = document.getElementById('guess-word')

                var unknownLetter = document.createElement('i')
                unknownLetter.setAttribute('class', 'fa fa-times fa-5x')

                guessWord.appendChild(unknownLetter)
            }
        })

}

onkeypress = function (event) {

}


Swal.fire({
    imageUrl: './assets/images/waving_hand_sign_1024.gif',
    imageHeight: 125,
    imageAlt: 'A tall image',
    background: 'rgba(0,0,0,0.9)',
    html: `<h3 style="color:white;">Hello there,</h3>
            <h4 style="color:pink;"> Please enter your name below to begin</h4>`,
    input: 'text',
    preConfirm: (user) => {
        if (user !== "") {
            gameState.user = user;
            document.getElementById('user').innerHTML = "<h2>Welcome <span style='color:pink;'>" + toTitleCase(user) + "</span></h2>";
        } else {
            gameState.user = "Stranger";
            document.getElementById('user').innerHTML = "<h2>Welcome <span style='color:pink;'>Stranger</span></h2>";
        }
        setup()

    }
})