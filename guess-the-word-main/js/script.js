// unordered list where players guessed letters appear
const guessedLettersElement = document.querySelector(".guessed-letters");
// Guess! button
const button = document.querySelector(".guess");
// text input field
const letterInput = document.querySelector(".letter");
// paragraph where word appears
const wordInProgress = document.querySelector(".word-in-progress");
// paragraph where remaining guesses display
const remainingGuesses = document.querySelector(".remaining");
// span inside paragraph where remaining guesses display
const remainingNumber = document.querySelector(".remaining span");
// paragraph where messages appear when player guesses a letter
const message = document.querySelector(".message");
// hidden button that appears to play again
const playAgain = document.querySelector(".play-again");

// starting word for testing
let word = "mangolia";
let remaining = 8;
let guessedLetters = [];

//function to assign random word from text file
const getWord = async function () {
    const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const data = await res.text();
    // console.log(data);
    const wordArray = data.split("\n");
    // console.log(wordArray);
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
};

// function to update word-in-progress with ● symbol for each letter of the word
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        // console.log(letter); // separates each letter in word into an array
        placeholderLetters.push("★");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};

getWord();

// event listener for button
button.addEventListener("click", function (e) {
    // prevent reloading behavior when clicking button
    e.preventDefault();
    message.innerText = "";
    // capture users input value
    const yourGuess = letterInput.value;
    // make sure single letter
    const goodGuess = playersInput(yourGuess);
    if (goodGuess) {
        makeGuess(yourGuess);
    };
    // empty input value after hitting guess button
    letterInput.value = "";
});

// function to check player input
const playersInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter";
    } else if (input.length >= 2) {
        message.innerText = "Please enter 1 letter at a time";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Only letters are accepted";
    } else {
        return input;
    }
};

// function to capture input
const makeGuess = function (yourGuess) {
    yourGuess = yourGuess.toUpperCase();
    if (guessedLetters.includes(yourGuess)) {
        message.innerText = "You already guessed that letter";
    } else {
        guessedLetters.push(yourGuess);
        // console.log(guessedLetters);
        showGuessedLetters(guessedLetters);
        guessesLeft(yourGuess);
        wordUpdateProgress(guessedLetters);
    }
};

// function to display guessed letters
const showGuessedLetters = function () {
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

// function to update word in progress
const wordUpdateProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    // split("") splits word string into array so letter can appear in guessedLetters array
    const wordArray = wordUpper.split("");
    // console.log(wordArray);
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("★");
        }
    }
    wordInProgress.innerText = revealWord.join("");
    wonGame();
};

// function to count guesses remaining
const guessesLeft = function (yourGuess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(yourGuess)) {
        message.innerText = `No ${yourGuess}, try again!`;
        remaining -= 1;
    } else {
        message.innerText = "That letter is in the word!";
    }

    if (remaining === 0) {
        message.innerText = `Game over! The word was ${word}`;
        startOver();
    } else if (remaining === 1) {
        remainingNumber.innerText = `${remaining} guess`;
    } else if (remaining > 1) {
        remainingNumber.innerText = `${remaining} guesses`;
    }
};

// function to check if player won
const wonGame = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
        startOver();
    }
};

const startOver = function () {
    button.classList.add("hide");
    remainingGuesses.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgain.classList.remove("hide");
};

playAgain.addEventListener("click", function () {
    message.classList.remove("win");
    guessedLetters = [];
    remaining = 8;
    remainingNumber.innerText = `${remaining} guesses`;
    guessedLettersElement.innerHTML = "";
    message.innerText = "";
    getWord();

    button.classList.remove("hide");
    remainingGuesses.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
    playAgain.classList.add("hide");
});
