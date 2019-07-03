// Day by day we stray futher from God

// Alphabet to match key strokes to valid alphetic characters
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

// References for success gifs
const successImages = ["beaming_face_with_smiling_eyes_1024.gif",
    "grinning_squinting_face_1024.gif",
    "heart_eyes_1024.gif",
    "hugging_face_1024.gif",
    "money_mouth_face_1024.gif",
    "smiling_face_with_halo_1024.gif",
    "star_struck_1024.gif",
    "tears_of_joy_1024.gif"
]

// References for failure gifs
const failImages = ["angry_face_1024.gif",
    "cold_face_1024.gif",
    "crying_face_1024.gif",
    "face_with_head_bandage_1024.gif",
    "loudly_crying_face_1024.gif",
    "serious_face_with_symbols_covering_mouth_1024.gif",
    "triumph_face_1024.gif"
]

// Offline words array incase wordnik api cannot be reached
const offlineWords = ["fine", "restrict", "hesitate", "layout", "contrary", "classroom", "concrete", "advocate", "year", "species", "hardship", "leftovers", "employ", "barrel", "central", "triangle", "breathe", "freckle", "reason", "barrier", "apparatus", "artist", "filter", "ask", "community", "dentist", "embox", "predator", "criticism", "eyebrow", "tiptoe", "cold", "realize", "coverage", "battle", "paradox", "symptom", "change", "index", "decide", "hen", "fade", "meal", "hide", "quiet", "tool", "pupil", "copper", "drawing", "value", "laser", "table", "heaven", "parallel", "confine", "testify", "hear", "allowance", "clean", "breed", "series", "tiger", "rhythm", "shaft", "strong", "depart", "conscious", "chord", "thin", "plan", "affect", "shot", "black", "trail", "intention", "activity", "degree", "slump", "scheme", "twist", "pasture", "brother", "frog", "knowledge", "childish", "injury", "bolt", "finance", "flat", "overview", "van", "decisive", "warm", "memory", "treasurer", "entertain", "prison", "easy", "gold", "resource"]

// Const reference to the word to guess div as it is used multiple times
const guessWord = document.getElementById('guess-word')


// Stores variables that change according to game state
var gameState = {
    user: "",
    wins: 0,
    losses: 0,
    remainingTries: 12,
    currentWord: "",
    currentWordLetters: [],
    usedLetters: [],
    gameStarted: false
}

// Util function to convert username to title case
var toTitleCase = function (str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

document.getElementById('hint-button').onclick = function(event){
    
Swal.fire({
    imageUrl: './assets/images/rocket_1024.gif',
    imageHeight: 125,
    imageAlt: 'A tall image',
    background: 'rgba(0,0,0,0.9)',
    html: `<h3 style="color:white;">Loading Hint...</h3>`,
    allowOutsideClick: false, 
    showConfirmButton : false, 
    backdrop : 'rgba(255,105,180,0.4)'
    
})

    fetch(`http://api.wordnik.com/v4/word.json/${gameState.currentWord}/definitions?api_key=uzuceirqshtna9m74vpps369l8w6ro1pspd2zvrw8the4welt`)
    .then(response => response.json())
    
    .then(function (data) {

        data[0]['text'] !==  undefined ?
        Swal.update({
            imageUrl: `./assets/images/success-image/${successImages[Math.floor(Math.random() * successImages.length)]}`,
            imageHeight: 125,
            background: 'rgba(0,0,0,0.9)',
            html: `<h3 style="color:white;">Hint</h3>
                   <p style="color:pink;">${data[0]['text']}</p>`,
            allowOutsideClick: false, 
            showConfirmButton : true, 
        })
        :
        Swal.update({
            imageUrl: `./assets/images/flushed_face_1024.gif`,
            imageHeight: 125,
            background: 'rgba(0,0,0,0.9)',
            html: `<h3 style="color:white;">Well this is embarrassing</h3>
                   <p style="color:pink;">Looks like we couldn't fetch the hint for this word</p>
                   <p style="color:pink;">You're on your own kiddo</p>`,
            allowOutsideClick: false, 
            showConfirmButton : true
        })

    })
    .catch(error => {
        Swal.update({
            imageUrl: `./assets/images/flushed_face_1024.gif`,
            imageHeight: 125,
            background: 'rgba(0,0,0,0.9)',
            html: `<h3 style="color:white;">Well this is embarrassing</h3>
                   <p style="color:pink;">Looks like we couldn't fetch the hint for this word</p>
                   <p style="color:pink;">You're on your own kiddo</p>`,
            allowOutsideClick: false, 
            showConfirmButton : true
        })
    })
}

var setup = function () {

    fetch('https://api.wordnik.com/v4/words.json/randomWord?minLength=4&maxLength=10&includePartOfSpeech=noun&api_key=uzuceirqshtna9m74vpps369l8w6ro1pspd2zvrw8the4welt')
        .then(response => response.json())
        .then(function (data) {


            gameState.currentWord = data.word
            gameState.gameStarted = true
            gameState.remainingTries = 12
            gameState.usedLetters = []
            document.getElementById('tries-left').textContent = gameState.remainingTries
            document.getElementById('guess-word').innerHTML = ""
            document.getElementById('used-letters').innerHTML = ""


            for (var i = 0; i < gameState.currentWord.length; i++) {
                gameState.currentWordLetters.push(gameState.currentWord.charAt(i).toLowerCase());

                if (i !== gameState.currentWord.length) {
                    var unknownLetter = document.createElement('i')
                    unknownLetter.setAttribute('class', 'fa fa-times fa-3x')
                    unknownLetter.setAttribute('style', 'color:pink;')
                    guessWord.appendChild(unknownLetter)
                }
            }

        })
        .catch(function (error) {
                console.log(error)

                gameState.currentWord = offlineWords[Math.floor(Math.random() * offlineWords.length)]
                gameState.gameStarted = true
                gameState.remainingTries = 12
                gameState.usedLetters = []
                document.getElementById('tries-left') = gameState.remainingTries
                document.getElementById('guess-word').innerHTML = ""
                document.getElementById('used-letters').innerHTML = ""

                for (var i = 0; i < gameState.currentWord.length; i++) {
                    console.log(gameState.currentWord)
                    console.log(gameState.currentWord.length)
                    gameState.currentWordLetters.push(gameState.currentWord.charAt(i).toLowerCase());

                    if (i !== gameState.currentWord.length) {
                        var unknownLetter = document.createElement('i')
                        unknownLetter.setAttribute('class', 'fa fa-times fa-3x')
                        unknownLetter.setAttribute('style', 'color:pink;')
                        guessWord.appendChild(unknownLetter)
                    }

                }
            }

        )


}

var setUsedLetters = function (success, guessLetter) {
    gameState.usedLetters.push(guessLetter.toLowerCase())


    var usedLetter = document.createElement('span')

    success ? usedLetter.setAttribute('class', 'badge badge-success') : usedLetter.setAttribute('class', 'badge badge-danger')
    usedLetter.setAttribute('style', 'margin:1px;')
    usedLetter.innerHTML = guessLetter.toUpperCase()
    document.getElementById('used-letters').appendChild(usedLetter)

    success ?
        document.getElementById('status-image').src = './assets/images/success-image/' + successImages[Math.floor(Math.random() * successImages.length)] :
        document.getElementById('status-image').src = './assets/images/fail-images/' + failImages[Math.floor(Math.random() * failImages.length)]

}

var checkWin = function (guesses, word) {
    if (word.every(letter => guesses.includes(letter))) {
        gameState.gameStarted = false
        Swal.fire({
            imageUrl: `./assets/images/success-image/${successImages[Math.floor(Math.random() * successImages.length)]}`,
            imageHeight: 125,
            background: 'rgba(0,0,0,0.9)',
            html: `<h3 style="color:white;">Woohoo you win</h3>
                    <h4 style="color:pink;">Press the enter button to restart or click the button below</h4>`,
            allowOutsideClick: false,
            backdrop : 'rgba(255,105,180,0.2)',
            preConfirm: () => {
                gameState.wins = gameState.wins + 1
                document.getElementById('wins').textContent = gameState.wins
                gameState.currentWord = ""
                gameState.currentWordLetters = []
                guessWord.innerHTML = ""
                setup()
            }
        })
    }
}

var endGame = function () {
    gameState.gameStarted = false
    Swal.fire({
        imageUrl: `./assets/images/fail-images/${failImages[Math.floor(Math.random() * failImages.length)]}`,
        imageHeight: 125,
        background: 'rgba(0,0,0,0.9)',
        html: `<h3 style="color:white;">Welp! You lost</h3>
                <h4 style="color:pink;"> The word was ${gameState.currentWord.toUpperCase()}. Click on the button below to start again</h4>`,
        allowOutsideClick: false,
        backdrop : 'rgba(255,105,180,0.2)',
        preConfirm: () => {
            gameState.losses = gameState.losses + 1
            document.getElementById('losses').textContent = gameState.losses
            gameState.currentWord = ""
            gameState.currentWordLetters = []
            guessWord.innerHTML = ""
            setup()
        }
    })
}

onkeypress = function (event) {
    var guessLetter = event.key.toLowerCase()
    if (alphabet.includes(guessLetter) && gameState.gameStarted) {
        if (gameState.currentWordLetters.includes(guessLetter)) {

            for (i = 0; i < gameState.currentWordLetters.length; i++) {
                console.log(gameState.currentWordLetters.length);
                if (gameState.currentWordLetters[i] === guessLetter) {

                    var replaceLetter = document.createElement('span')
                    replaceLetter.setAttribute('class', 'guess-letter')
                    replaceLetter.innerHTML = guessLetter.toUpperCase()
                    console.log(guessWord.childNodes)
                    guessWord.replaceChild(replaceLetter, guessWord.childNodes[i])
                }
            }
            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))) {
                setUsedLetters(true, guessLetter)

                checkWin(gameState.usedLetters, gameState.currentWordLetters)
            }


        } else {

            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))) {
                setUsedLetters(false, guessLetter)

                gameState.remainingTries = gameState.remainingTries - 1

                gameState.remainingTries === 0 ? endGame() : document.getElementById('tries-left').textContent = gameState.remainingTries

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
    backdrop : 'rgba(255,105,180,0.2)',
    allowOutsideClick: false,
    preConfirm: (user) => {
        if (user !== "") {
            gameState.user = user;
            document.getElementById('user').innerHTML = `<h2>Welcome <span style='color:pink;'>${toTitleCase(user)}</span></h2>`;
        } else {
            gameState.user = "Stranger";
            document.getElementById('user').innerHTML = "<h2>Welcome <span style='color:pink;'>Stranger</span></h2>";
        }
        setup()

    }
})