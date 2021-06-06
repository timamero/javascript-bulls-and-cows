const instructionsBtn = document.querySelector('.instructions-btn')
const instructionsPopUp = document.querySelector('.instructions')
const instructionsCloseBtn = document.getElementById('instructions-close-btn')
const aboutBtn = document.querySelector('.about-btn')
const aboutPopUp = document.querySelector('.about')
const aboutCloseBtn = document.getElementById('about-close-btn')

const guessFieldInput = document.querySelector('.game__guessfield-input');
const guessSubmitBtn = document.querySelector('.game__guesssubmit-btn');
const resultsHistory = document.querySelector('.results__history');
const gameMessage = document.querySelector('.game__message');
const resultsGuessCountDown = document.querySelector('.results__guesscountdown');
const newGameBtn = document.querySelector('.new-game-btn');



instructionsBtn.addEventListener('click', () => instructionsPopUp.classList.toggle('show-instructions'))
instructionsCloseBtn.addEventListener('click', () => instructionsPopUp.classList.toggle('show-instructions'))
aboutBtn.addEventListener('click', () => aboutPopUp.classList.toggle('show-about'))
aboutCloseBtn.addEventListener('click', () => aboutPopUp.classList.toggle('show-about'))


// Initialize Game
guessFieldInput.focus();

let displayCurrentBullsAndCows = ''
let maxGuesses = 20
let guessCountDown = maxGuesses;
let numberToGuess = generateRandomNumber()
let previousGuess = ''
resultsGuessCountDown.textContent = `You have ${maxGuesses} guesses remaining`
gameMessage.textContent = 'Guess the four digit code.'
console.log('number to guess: ' + numberToGuess)

guessSubmitBtn.addEventListener('click', checkGuess)
newGameBtn.addEventListener('click', resetGame)


// Game functions
function generateRandomNumber() {
    // Generate random 4-digit number that can have leading zeros
    let randomNumber = [];
    for (let i = 0; i < 4; i++) {
        randomNumber.push(Math.floor(Math.random() * 10));
    }
    return randomNumber;
}

function checkGuess() {
    let userGuess = guessFieldInput.value;

    // Check that user's input is a four digit number
    let digitRegex = /^[0-9]{4}$/;
    if (digitRegex.test(userGuess)) {

        if (displayCurrentBullsAndCows) {
            resultsHistory.innerHTML = `<div class="results__previousguess-wrapper"><p class="results__previousguess">${previousGuess}</p><div class="results__img-wrapper">${displayCurrentBullsAndCows}</div></div>` + resultsHistory.innerHTML
        }

        // Check user's guess matches the number to guess
        if (userGuess == numberToGuess.join('')) {
            resultsGuessCountDown.textContent = `You got the correct number with ${maxGuesses} guesses remaining`
            let winningDisplay = `<p class="winning-message">${userGuess} is correct! </p><div class="results__img-wrapper">`
            for (let i = 0; i < 4; i++) {
                winningDisplay += '<img class="results__img" src="images/bull.svg" alt="Image of Bull"/>'
            }
            winningDisplay += '</div>'
            gameMessage.innerHTML = winningDisplay
            endGame()
        } else {
            // if (guessCountDown == maxGuesses) {
            //     resultsGuessCountDown.textContent = `You have ${maxGuesses} guesses remaining`
            // }

            // Get number of bulls and cows
            let [bulls, cows] = getCowsAndBulls(userGuess, numberToGuess)
            
            displayCurrentBullsAndCows = ''
            if (bulls == 0 && cows == 0) {
                displayCurrentBullsAndCows += '<img class="results__img" src="images/number.svg" alt="Image of zero"/>'
            }
            for (let i = 0; i < (Number(bulls)); i++) {
                displayCurrentBullsAndCows += '<img class="results__img" src="images/bull.svg" alt="Image of Bull"/>'
            }
            for (let i = 0; i < (Number(cows)); i++) {
                displayCurrentBullsAndCows += '<img class="results__img" src="images/sacred-cow.svg" alt="Image of Cow"/>'
            }
            gameMessage.innerHTML = `<p class="current-guess">${userGuess}: </p><div class="results__img-wrapper">${displayCurrentBullsAndCows}</div>`
            // resultsHistory.innerHTML = `<p>${userGuess}</p><div class="results__img-wrapper">${displayCurrentBullsAndCows}</div>` + resultsHistory.innerHTML
            
            guessCountDown--;
            
            if (guessCountDown == 0) {
                resultsGuessCountDown.textContent = 'You ran out of guesses'
                gameMessage.innerHTML = `<p>Game over! The correct number was ${numberToGuess.join('')}</p>`
                endGame()
            } else {
                resultsGuessCountDown.textContent = `You have ${guessCountDown} guesses remaining`
            }

            previousGuess = userGuess;
            guessFieldInput.value = ''
            guessFieldInput.focus();
        }

        
        

    } else {
        gameMessage.innerHTML = '<p>Not a valid guess.  Try again.</p>'
    }
}


// Count and return the number of cows and bulls
function getCowsAndBulls(userGuess, numberToGuess) { 
    // Convert userGuess to list so both numberToGuess and userGuess are the same type
    let guess = userGuess.split('')
    let toGuess = [...numberToGuess]
    let bullsInUsersGuess = [...guess]
    // First get bulls in the users guess and replace number with 'bull'
    for (let i = 0; i < 4; i++) {
        if (guess[i] == toGuess[i]) {
            toGuess.splice(i, 1, 'checked')
            bullsInUsersGuess.splice(i, 1, 'bull')
        }
    }
    // Next get the cows in the users guess and replace the number with 'cow'
    bullsAndCowsInUsersGuess = bullsInUsersGuess.map(function(item) {
        if (toGuess.includes(Number(item))) {
            index = toGuess.indexOf(Number(item))
            toGuess.splice(index, 1, 'checked')
            return 'cow'
        }
        return item
    })
    
    // Count the number of bulls and cows
    let bullsCount = 0
    let cowsCount = 0
    for (let i = 0; i < 4; i++) {
        if (bullsAndCowsInUsersGuess[i] === 'bull') {
            bullsCount++
        } else if (bullsAndCowsInUsersGuess[i] === 'cow') {
            cowsCount++
        }
    }
    return [bullsCount, cowsCount]
}

function endGame() {
    guessSubmitBtn.disabled = true;
    guessFieldInput.disabled = true;

    guessSubmitBtn.classList.toggle('disabled-btn')
}

function resetGame() {
    numberToGuess = generateRandomNumber()
    guessCountDown = maxGuesses;
    displayCurrentBullsAndCows = ''
    resultsGuessCountDown.textContent = `You have ${maxGuesses} guesses remaining`
    resultsHistory.innerHTML = ''
    gameMessage.innerHTML = ''
    guessFieldInput.value = ''
    guessSubmitBtn.disabled = false;
    guessFieldInput.disabled = false;
    guessSubmitBtn.classList.toggle('disabled-btn')

    console.log('number to guess: ' + numberToGuess)
}
