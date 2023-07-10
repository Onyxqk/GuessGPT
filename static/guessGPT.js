var guesses = 0;
var secretWord = '';

document.addEventListener('DOMContentLoaded', function() {
    getRandomWord()
      .then(randomWord => {
        secretWord = randomWord;
      })
      .catch(error => console.error(error));
  });

function getRandomWord() {
    return fetch('static/wordDictionary.json')
      .then(response => response.json())
      .then(wordDictionary => {
        var randomWord = Math.floor(Math.random() * wordDictionary.length);
        return wordDictionary[randomWord];
      });
}

function checkGuess() {
  var input = document.getElementById("input").value;
  input = input.toLowerCase();
  
  if (input === secretWord) {
    document.getElementById("result").innerHTML = "Congratulations! You guessed the word in " + guesses + " guesses.";
    document.getElementById("input").disabled = true;
  } else {
    var matchingLetters = 0;
    
    for (var i = 0; i < input.length; i++) {
      if (input[i] === secretWord[i]) {
        matchingLetters++;
      }
    }
    
    document.getElementById("result").innerHTML = "Matching letters: " + matchingLetters + " the secret word is " + secretWord;
    guesses++;
  }
  
  document.getElementById("input").value = "";
}

async function standardPromptSecret() {
  let input = document.getElementById("secret-input").value;
  input = input.toLowerCase();
  const response = await fetch("/standard_prompt"),
        responseValue = await response.text();
  document.getElementById("result").innerHTML = responseValue;

  
  document.getElementById("input").value = "";
}