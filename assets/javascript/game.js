// Alphabet to match key strokes to valid alphetic characters
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-"]

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

// Offline words array in case wordnik api cannot be reached
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

// Util function to generate sounds
var playAudio = function (url) {
    var audio = new Audio(url)
    audio.play()
}

// Opens the rules modal
document.getElementById('rules-button').onclick = function (event) {
    Swal.fire({
        imageUrl: './assets/images/trophy_1024.gif',
        imageHeight: 125,
        imageAlt: 'A tall image',
        background: 'rgba(0,0,0,0.9)',
        html: `<h3 style="color:white;">Rules</h3>
                <ul>
                    <li>A word will be selected at random and you have 12 tries to guess the word</li>
                    <li>To guess a word simply press the key that corresponds to that letter on your keyboard</li>
                    <li>Each incorrect guess reduces the number of guesses left. Correct guesses do not</li>
                    <li>Guesses are not reduced for typing a previouly incorrect guess again</li>
                    <li>A hint to the word can be found by clicking the hint button</li>
                </ul>`,
        backdrop: 'rgba(255,105,180,0.4)'

    })
}

// Opens the hints modal
document.getElementById('hint-button').onclick = function (event) {

    Swal.fire({
        imageUrl: './assets/images/rocket_1024.gif',
        imageHeight: 125,
        imageAlt: 'A tall image',
        background: 'rgba(0,0,0,0.9)',
        html: `<h3 style="color:white;">Loading Hint...</h3>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        backdrop: 'rgba(255,105,180,0.4)',
    })
    // Fetches defintion of the word in gamesState Object 
    fetch(`https://api.wordnik.com/v4/word.json/${gameState.currentWord}/definitions?api_key=uzuceirqshtna9m74vpps369l8w6ro1pspd2zvrw8the4welt`)
        .then(response => response.json())

        .then(function (data) {
            // Fires modal with definition
            if (data[0]['text'] !== undefined){
                Swal.update({
                    imageUrl: `./assets/images/face_with_monocle_1024.gif`,
                    imageHeight: 125,
                    background: 'rgba(0,0,0,0.9)',
                    html: `<h3 style="color:white;">Hint</h3>
                   <p style="color:pink;">${data[0]['text']}</p>`,
                    allowOutsideClick: false,
                    showConfirmButton: true,
                }) 
            }else{
                //Fires error modal if api returns undefined
                Swal.update({
                    imageUrl: `./assets/images/flushed_face_1024.gif`,
                    imageHeight: 125,
                    background: 'rgba(0,0,0,0.9)',
                    html: `<h3 style="color:white;">Well this is embarrassing</h3>
                    <p style="color:pink;">Looks like we couldn't fetch the hint for this word</p>
                    <p style="color:pink;">You're on your own kiddo</p>`,
                    allowOutsideClick: false,
                    showConfirmButton: true
                })
            }
        })
        .catch(error => {
            // Exception handler for failed fetch
            console.log(error)
            Swal.update({
                imageUrl: `./assets/images/flushed_face_1024.gif`,
                imageHeight: 125,
                background: 'rgba(0,0,0,0.9)',
                html: `<h3 style="color:white;">Well this is embarrassing</h3>
                   <p style="color:pink;">Looks like we couldn't fetch the hint for this word</p>
                   <p style="color:pink;">You're on your own kiddo</p>`,
                allowOutsideClick: false,
                showConfirmButton: true
            })
        })
}

// Sets up the game
var setup = function () {
    // Fetches a new word from wordnik api
    fetch('https://api.wordnik.com/v4/words.json/randomWord?minLength=4&maxLength=10&includePartOfSpeech=noun&api_key=uzuceirqshtna9m74vpps369l8w6ro1pspd2zvrw8the4welt')
        .then(response => response.json())
        .then(function (data) {

            // Resets game state and DOM to start new game
            gameState.currentWord = data.word
            gameState.gameStarted = true
            gameState.remainingTries = 12
            gameState.usedLetters = []
            document.getElementById('tries-left').textContent = gameState.remainingTries
            document.getElementById('guess-word').innerHTML = ""
            document.getElementById('used-letters').innerHTML = ""


            for (var i = 0; i < gameState.currentWord.length; i++) {
                // Appends each letter of the guess word to a 'Letter to guess' array
                gameState.currentWordLetters.push(gameState.currentWord.charAt(i).toLowerCase());

                // Dynamically adds font awesome 'X' to based on length of fetched word
                var unknownLetter = document.createElement('i')
                unknownLetter.setAttribute('class', 'fa fa-times fa-3x')
                unknownLetter.setAttribute('style', 'color:pink;')
                guessWord.appendChild(unknownLetter)
            }
        })
        .catch(function (error) {
                // Exception handler for when the api does a doodoo
                console.log(error)
                // Picks a random word from the offline word array 
                gameState.currentWord = offlineWords[Math.floor(Math.random() * offlineWords.length)]

                // Resets game state and DOM to start new game
                gameState.gameStarted = true
                gameState.remainingTries = 12
                gameState.usedLetters = []
                document.getElementById('tries-left') = gameState.remainingTries
                document.getElementById('guess-word').innerHTML = ""
                document.getElementById('used-letters').innerHTML = ""

                for (var i = 0; i < gameState.currentWord.length; i++) {
                    // Appends each letter of the guess word to a 'Letter to guess' array
                    gameState.currentWordLetters.push(gameState.currentWord.charAt(i).toLowerCase());
                    // Dynamically adds font awesome 'X' to based on length of fetched word
                    var unknownLetter = document.createElement('i')
                    unknownLetter.setAttribute('class', 'fa fa-times fa-3x')
                    unknownLetter.setAttribute('style', 'color:pink;')
                    guessWord.appendChild(unknownLetter)
                }
            }

        )


}

var setUsedLetters = function (success, guessLetter) {

    // Adds the user input to a guesses array 
    gameState.usedLetters.push(guessLetter.toLowerCase())

    // Creates a span to add to guess words in the DOM
    var usedLetter = document.createElement('span')

    // Logic to determine guess badge type based on correct or incorrect guesses
    success ? usedLetter.setAttribute('class', 'badge badge-success') : usedLetter.setAttribute('class', 'badge badge-danger')
    usedLetter.setAttribute('style', 'margin:1px;')
    usedLetter.innerHTML = guessLetter.toUpperCase()
    // Adds new guessed letter to the DOM
    document.getElementById('used-letters').appendChild(usedLetter)

    // Picks random success/fail image based on guess
    success ?
        document.getElementById('status-image').src = './assets/images/success-image/' + successImages[Math.floor(Math.random() * successImages.length)] 
        :
        document.getElementById('status-image').src = './assets/images/fail-images/' + failImages[Math.floor(Math.random() * failImages.length)]

}

var checkWin = function (guesses, word) {
    // simplest solution that checks if all letters in the guess word are in the user guesses array
    // Yes I could have used a for loop. Yes I am a lazy coder.
    if (word.every(letter => guesses.includes(letter))) {

        // Sets game state to false to prevent recording further user inputs
        gameState.gameStarted = false

        // Fires win modal
        Swal.fire({
            imageUrl: `./assets/images/success-image/${successImages[Math.floor(Math.random() * successImages.length)]}`,
            imageHeight: 125,
            background: 'rgba(0,0,0,0.9)',
            html: `<h3 style="color:white;">Woohoo you win</h3>
                    <h4 style="color:pink;">Press the enter button to restart or click the button below</h4>`,
            allowOutsideClick: false,
            backdrop: 'rgba(255,105,180,0.2)',
            preConfirm: () => {
                // Adds win and restarts game
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
    // Sets game state to false to prevent recording further user inputs
    gameState.gameStarted = false
    // Fires loss modal
    Swal.fire({
        imageUrl: `./assets/images/fail-images/${failImages[Math.floor(Math.random() * failImages.length)]}`,
        imageHeight: 125,
        background: 'rgba(0,0,0,0.9)',
        html: `<h3 style="color:white;">Welp! You lost</h3>
                <h4 style="color:pink;"> The word was <span style="color:white;">${gameState.currentWord.toUpperCase()}</span>.</h4>
                <p style="color:white;">Click on the button below to start again</p>`,
        allowOutsideClick: false,

        backdrop: 'rgba(255,105,180,0.2)',
        preConfirm: () => {
            // Adds loss and restarts game
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

    // Records user input and converts to lowercase
    var guessLetter = event.key.toLowerCase()
    // Checks if input was valid and the game has started
    if (alphabet.includes(guessLetter) && gameState.gameStarted) {
        if (gameState.currentWordLetters.includes(guessLetter)) {

            // Loops through the letter of the guess word to find matches
            for (i = 0; i < gameState.currentWordLetters.length; i++) {
                if (gameState.currentWordLetters[i] === guessLetter) {

                    // Replaces "X" in the DOM with the guess letter
                    var replaceLetter = document.createElement('span')
                    replaceLetter.setAttribute('class', 'guess-letter')
                    replaceLetter.innerHTML = guessLetter.toUpperCase()
                    guessWord.replaceChild(replaceLetter, guessWord.childNodes[i])
                }
            }
            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))) {
                // Runs win logic 
                setUsedLetters(true, guessLetter)

                playAudio('https://www.soundjay.com/misc/sounds/magic-chime-02.mp3')

                checkWin(gameState.usedLetters, gameState.currentWordLetters)
            }


        } else {

            if (!(gameState.usedLetters.includes(guessLetter.toLowerCase()))) {
                // Runs loss logic
                setUsedLetters(false, guessLetter)

                playAudio('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-27787/zapsplat_multimedia_game_sound_error_incorrect_001_30721.mp3')

                // Reduces the tries left
                gameState.remainingTries = gameState.remainingTries - 1

                // If there are no tries left end the game
                gameState.remainingTries === 0 ? endGame() : document.getElementById('tries-left').textContent = gameState.remainingTries

            }
        }
    }
}



// Startup modal
Swal.fire({
    imageUrl: './assets/images/waving_hand_sign_1024.gif',
    imageHeight: 125,
    imageAlt: 'A tall image',
    background: 'rgba(0,0,0,0.9)',
    html: `<h3 style="color:white;">Hello there,</h3>
            <h4 style="color:pink;"> Please enter your name below to begin</h4>`,
    input: 'text',
    backdrop: 'rgba(255,105,180,0.2)',
    allowOutsideClick: false,
    allowEscapeKey: false,
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