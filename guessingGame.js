function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr) {
  var curr = arr.length;
  while (curr) {
    var i = Math.floor(Math.random() * curr--);
    var temp = arr[curr];
    arr[curr] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses =[];
  this.winningNumber = generateWinningNumber();
  console.log(this.winningNumber);
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
  if (!guess || guess < 1 || guess > 100) {
    return "That is an invalid guess.";
  }
  this.playersGuess = guess;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  if (this.winningNumber === this.playersGuess) {
    $('#hint, #submit').prop("disabled",true);
    $('#directions').text("Press 'Reset' to play again!");
    return "You Win!";
  }
  if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
    return "You have already guessed that number.";
  }
  this.pastGuesses.push(this.playersGuess);
  $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
  if (this.pastGuesses.length === 5) {
    $('#hint, #submit').prop("disabled",true);
    $('#directions').text("Press 'Reset' to play again!");
    return "You Lose.";
  } else {
    var difference = this.difference();
    if (this.isLower()) {
      $('#directions').text("Guess Higher!");
    } else {
      $('#directions').text("Guess Lower!");
    }
    if (difference < 10) {
      return "You're burning up!";
    }
    if (difference < 25) {
      return "You're lukewarm.";
    }
    if (difference < 50) {
      return "You're a bit chilly.";
    }
    if (difference < 100) {
      return "You're ice cold!";
    }
  }
}

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  return shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
}

function enterGuess(game) {
  var guess = +$('#player-input').val();
  $('#player-input').val("");
  var result = game.playersGuessSubmission(guess);
  $('#title').text(result);
}

$(document).ready(function() {
  var game = newGame();

  $('#submit').on('click', function() {
    enterGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if (event.which === 13 ) {
      enterGuess(game);
    }
  });

  $('#hint').on('click', function() {
    var hint = game.provideHint();
    $('#title').text("This number is "+hint[0]+", "+hint[1]+", or "+hint[2]);
  });

  $('#reset').on('click', function() {
    game = newGame();
    $('#title').text("GUESSING GAME");
    $('#directions').text("Guess a number between 1-100")
    $('.guess').text("?");
    $('#hint, #submit').prop("disabled", false);
  });

});
