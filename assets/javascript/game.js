const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const guessWord = document.getElementById('guess-word')

var gameState = {
    user: "",
    wins: 0,
    losses: 0,
    remainingTries: 12,
    currentWord: "",
    currentWordLetters: [], 
    usedLetters : [],
    gameStarted : false
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
            gameState.gameStarted = true

            for (var i = 0; i < gameState.currentWord.length; i++) {
                gameState.currentWordLetters.push(gameState.currentWord.charAt(i).toLowerCase());
               
                if(i !== gameState.currentWord.length -1){
                    var unknownLetter = document.createElement('i')
                    unknownLetter.setAttribute('class', 'fa fa-times fa-3x')
                    unknownLetter.setAttribute('style', 'color:pink;')
                    guessWord.appendChild(unknownLetter)
                }

            }

        })


}

onkeypress = function (event) {
    var guessLetter = event.key.toLowerCase()
    if (alphabet.includes(guessLetter) && gameState.gameStarted){
        if(gameState.currentWordLetters.includes(guessLetter)){
            
            
            for(i=0; i<gameState.currentWordLetters.length+1; i++){
                console.log(gameState.currentWordLetters.length-1);
                if (gameState.currentWordLetters[i]  === guessLetter){
                    
                    var replaceLetter = document.createElement('span')
                    replaceLetter.setAttribute('class', 'guess-letter')
                    replaceLetter.innerHTML = guessLetter.toUpperCase()
                    guessWord.replaceChild(replaceLetter,guessWord.childNodes[i])
                }
            }
            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))){
                
                gameState.usedLetters.push(guessLetter.toLowerCase())

                var usedLetter = document.createElement('span')
                usedLetter.setAttribute('class', 'badge badge-success')
                usedLetter.setAttribute('style', 'margin:1px;')
                usedLetter.innerHTML = guessLetter.toUpperCase()
                document.getElementById('used-letters').appendChild(usedLetter)
            }

        }
        else{

            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))){
                
                gameState.usedLetters.push(guessLetter.toLowerCase())

                var usedLetter = document.createElement('span')
                usedLetter.setAttribute('class', 'badge badge-danger')
                usedLetter.setAttribute('style', 'margin:1px;')
                usedLetter.innerHTML = guessLetter.toUpperCase()
                document.getElementById('used-letters').appendChild(usedLetter)
            }
        }
    }
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