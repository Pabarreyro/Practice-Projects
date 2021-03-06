//business logic
function Die(){
  this.value = Math.floor((Math.random() * 6) + 1);
};

function Turn() {
  this.runningTotal = [];
  this.rollCount = 0;
  this.rollAgain = true;
  this.sum = 0;
};

function Hand() {
  this.total = 0;
};

function Game(mode) {
  this.currentPlayer = Math.floor((Math.random() * 2) + 1);
  this.mode = mode;
};

Turn.prototype.newRoll = function() {
  var tempRoll = new Die();
  if(tempRoll.value !== 1){
    this.runningTotal.unshift(tempRoll.value);
  } else {
    this.rollAgain = false;
  }
};

// if (this.rollAgain === true) {
//   this.lastRoll = Math.floor((Math.random() * 6) + 1);
// }

Turn.prototype.compRolls = function() {
  for (var i = 0; i < 2; i++) {
    if (this.rollAgain === true) {
      this.newRoll();
    }
  }
};

Turn.prototype.sumArray = function() {
  this.sum = 0;
  var runningSum = 0;

  this.runningTotal.forEach(function(element){
    runningSum += element;
  });

  this.sum += runningSum;
};

Turn.prototype.resetTurnStats = function () {
  this.runningTotal = [];
  this.rollCount = 0;
  this.rollAgain = true;
  this.sum = 0;
};

Hand.prototype.updateScore = function(turn) {
  this.total += turn.sum;
};

Hand.prototype.checkWin = function(){
  if(this.total >= 100){
    return true;
  }else{
    return false;
  }
};

Game.prototype.changePlayer = function() {
  if (this.currentPlayer === 1) {
    this.currentPlayer = 2;
  } else {
    this.currentPlayer = 1;
  }
};



//user logic
function showHide(number){
  //split this into show/hide functions
  $("#player-board-" + number + " button.roll").toggle();
  $("#player-board-"+ number + " button.hold").toggle();
};

$(document).ready(function(){
  $("#mode-selection button").click(function(){

    $("#mode-selection").hide();
    var newGame = new Game(this.textContent);
    //put conditional logic for setting up vs computer

    $("#game-board").toggleClass('hide');
    $("#game-board").attr('display', 'flex');
    $("#game-board").attr('flex-direction', 'row');

    var playerOneHand = new Hand();
    var playerTwoHand = new Hand();

    var currentTurn1 = new Turn();
    var currentTurn2 = new Turn();

    if (newGame.mode === "Single") {
      if (newGame.currentPlayer === 1) {
        showHide("two");
      } else {
        showHide("one");

        currentTurn2.compRolls();
        if (currentTurn2.rollAgain === true) {
          $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[0] + "</li>");
          $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[1] + "</li>");

          currentTurn2.sumArray();
          $("#turn-score-two").text(currentTurn2.sum);

          playerTwoHand.updateScore(currentTurn2);
          $("#player2-score").text(playerTwoHand.total);

          showHide("two");
          showHide("one");
        } else {
          $("#turn-score-two").text("Bust!");
          showHide("two");
          showHide("one");
        }
        currentTurn2.resetTurnStats();
      }

      $("#player-board-one button.roll").click(function() {
        $("ul#player-two-rolls").empty();
        if(currentTurn1.rollAgain === true){
          currentTurn1.newRoll();
          if (currentTurn1.rollAgain === true){
            $("ul#player-one-rolls").append("<li>" + currentTurn1.runningTotal[0] + "</li>");

            currentTurn1.sumArray();
            $("#turn-score-one").text(currentTurn1.sum);
          } else {
            $("ul#player-one-rolls").append("<li>Bust!</li>");
            $("#turn-score-one").text("Bust!");
            showHide("two");
            showHide("one");
            $("ul#player-one-rolls").empty();
            $("#turn-score-one").empty();

            currentTurn1.resetTurnStats();

            currentTurn2.compRolls();
            if (currentTurn2.rollAgain === true) {
              $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[0] + "</li>");
              $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[1] + "</li>");
              currentTurn2.sumArray();

              $("#turn-score-two").text(currentTurn2.sum);
              playerTwoHand.updateScore(currentTurn2);
              $("#player2-score").text(playerTwoHand.total);
              showHide("two");
              showHide("one");

            } else {
              $("#turn-score-two").text(currentTurn2.sum);
              showHide("two");
              showHide("one");
            }
              currentTurn2.resetTurnStats();
            }
        }
      });

      $("#player-board-one button.hold").click(function(){
        playerOneHand.updateScore(currentTurn1);
        if(playerOneHand.checkWin()){
          $("#player1-score").text(playerOneHand.total);
          alert("You've won!");
        } else{
          $("#player1-score").text(playerOneHand.total);
          showHide("two");
          showHide("one");
          $("ul#player-one-rolls").empty();
          $("#turn-score-one").empty();

          currentTurn1.resetTurnStats();

          currentTurn2.compRolls();
          if (currentTurn2.rollAgain === true) {
            $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[0] + "</li>");
            $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[1] + "</li>");
            currentTurn2.sumArray();

            $("#turn-score-two").text(currentTurn2.sum);
            playerTwoHand.updateScore(currentTurn2);
            $("#player2-score").text(playerTwoHand.total);
            showHide("two");
            showHide("one");
          } else {
            $("#turn-score-two").text("Bust!");
            showHide("two");
            showHide("one");
          }
            currentTurn2.resetTurnStats();
        }
      });
    } else {
      if (newGame.currentPlayer === 1) {
        showHide("two");
      } else {
        $("#player-board-one button.roll").hide();
        $("#player-board-one button.hold").hide();
      }

      $("#player-board-one button.roll").click(function() {
        if(currentTurn1.rollAgain === true){
          currentTurn1.newRoll();
          if (currentTurn1.rollAgain === true){
            $("ul#player-one-rolls").append("<li>" + currentTurn1.runningTotal[0] + "</li>");
            currentTurn1.sumArray();
            $("#turn-score-one").text(currentTurn1.sum);
          } else {
            $("ul#player-one-rolls").append("<li>Bust!</li>");
            $("#turn-score-one").text("Bust!");

            showHide("two");
            showHide("one");

            $("ul#player-one-rolls").empty();
            $("#turn-score-one").empty();

            currentTurn1.resetTurnStats();
          }
        }
      });

      $("#player-board-one button.hold").click(function(){
        playerOneHand.updateScore(currentTurn1);
        if(playerOneHand.checkWin()){
          $("#player1-score").text(playerOneHand.total);
          alert("You've won!");
        }else{
          $("#player1-score").text(playerOneHand.total);
          showHide("two");
          showHide("one");
          $("ul#player-one-rolls").empty();
          $("#turn-score-one").empty();

          currentTurn1.resetTurnStats();
        }
      });

      $("#player-board-two button.roll").click(function() {
        if(currentTurn2.rollAgain === true){
          currentTurn2.newRoll();
          if (currentTurn2.rollAgain === true){
            $("ul#player-two-rolls").append("<li>" + currentTurn2.runningTotal[0] + "</li>");
            currentTurn2.sumArray();
            $("#turn-score-two").text(currentTurn2.sum);
          } else {
            $("ul#player-two-rolls").append("<li>Bust!</li>");
            $("#turn-score-two").text("Bust!");

            showHide("two");
            showHide("one");

            $("ul#player-two-rolls").empty();
            $("#turn-score-two").empty();

            currentTurn2.resetTurnStats();
          }
        }
      });

      $("#player-board-two button.hold").click(function(){
        playerTwoHand.updateScore(currentTurn2);
        if(playerTwoHand.checkWin()){
          $("#player2-score").text(playerTwoHand.total);
          alert("You've won!");
        } else{
          $("#player2-score").text(playerTwoHand.total);

          showHide("two");
          showHide("one");

          $("ul#player-two-rolls").empty();
          $("#turn-score-two").empty();

          currentTurn2.resetTurnStats();
        }
      });
    }
  });
});
