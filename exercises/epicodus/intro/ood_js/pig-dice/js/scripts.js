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

function Game() {
  this.currentPlayer = Math.floor((Math.random() * 2) + 1);
};

Turn.prototype.newRoll = function() {
  var newRoll = new Die();

  if(newRoll.value !== 1){
    this.runningTotal.unshift(newRoll.value);
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
  this.runningTotal.forEach(function(element){
    this.sum += element;
  });
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
}

$(document).ready(function(){
  var mode = "";
  $("#mode-selection button").click(function(){

    $("#mode-selection").hide();
    mode = this.textContent;
    //put conditional logic for setting up vs computer

    $("#game-board").toggleClass('hide');
    $("#game-board").attr('display', 'flex');
    $("#game-board").attr('flex-direction', 'row');

    var newGame = new Game();

    var playerOneHand = new Hand();
    var playerTwoHand = new Hand();

    var currentTurn1 = new Turn();
    var turnScore1 = 0;
    var runningTotal1 = currentTurn1.runningTotal;

    var currentTurn2 = new Turn();
    var turnScore2 = 0;
    var runningTotal2 = currentTurn2.runningTotal;

    if (mode === "Single") {
      if (newGame.currentPlayer === 1) {
        showHide("two");

      } else {
        showHide("one");

        currentTurn2.compRoll();
        if (currentTurn2.rollAgain === true) {
          $("ul#player-two-rolls").append("<li>" + runningTotal2[0] + "</li>");
          $("ul#player-two-rolls").append("<li>" + runningTotal2[1] + "</li>");

          turnScore2 = currentTurn2.sumArray();
          $("#turn-score-two").text(turnScore2);

          playerTwoHand.updateScore(turnScore2);
          $("#player2-score").text(playerTwoHand.total);
          showHide("two");
          showHide("one");
        } else {
          $("#turn-score-two").text("Bust!");
          showHide("two");
          showHide("one");
        }

        currentTurn2.resetTurnStats();
        runningTotal2 = currentTurn2.runningTotal;
      }

      $("#player-board-one button.roll").click(function() {
        $("ul#player-two-rolls").empty();
        currentTurn1.playerRoll();
        if (currentTurn1.rollAgain === true){
          $("ul#player-one-rolls").append("<li>" + runningTotal1[0] + "</li>");
          turnScore1 = currentTurn1.sumArray();
          $("#turn-score-one").text(turnScore1);
        } else {
          $("ul#player-one-rolls").append("<li>Bust!</li>");
          $("#turn-score-one").text("Bust!");
          showHide("two");
          showHide("one");
          $("ul#player-one-rolls").empty();
          $("#turn-score-one").empty();

          currentTurn1.resetTurnStats();
          runningTotal1 = currentTurn1.runningTotal;

          currentTurn2.compRoll();
          if (currentTurn2.rollAgain === true) {
            $("ul#player-two-rolls").append("<li>" + runningTotal2[0] + "</li>");
            $("ul#player-two-rolls").append("<li>" + runningTotal2[1] + "</li>");
            turnScore2 = currentTurn2.sumArray();

            $("#turn-score-two").text(turnScore2);
            playerTwoHand.updateScore(turnScore2);
            $("#player2-score").text(playerTwoHand.total);
            showHide("two");
            showHide("one");

          } else {
            $("#turn-score-two").text(turnScore2);
            showHide("two");
            showHide("one");

          }

            currentTurn2.resetTurnStats();
            runningTotal2 = currentTurn2.runningTotal;
          }
      });

      $("#player-board-one button.hold").click(function(){
        playerOneHand.updateScore(turnScore1);
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
          runningTotal1 = currentTurn1.runningTotal;

          currentTurn2.compRoll();
          if (currentTurn2.rollAgain === true) {
            $("ul#player-two-rolls").append("<li>" + runningTotal2[0] + "</li>");
            $("ul#player-two-rolls").append("<li>" + runningTotal2[1] + "</li>");
            turnScore2 = currentTurn2.sumArray();

            $("#turn-score-two").text(turnScore2);
            playerTwoHand.updateScore(turnScore2);
            $("#player2-score").text(playerTwoHand.total);
            showHide("two");
            showHide("one");
          } else {
            $("#turn-score-two").text("Bust!");
            showHide("two");
            showHide("one");
          }

            currentTurn2.resetTurnStats();
            runningTotal2 = currentTurn2.runningTotal;
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
        currentTurn1.playerRoll();
        if (currentTurn1.rollAgain === true){
          $("ul#player-one-rolls").append("<li>" + runningTotal1[0] + "</li>");
          turnScore1 = currentTurn1.sumArray();
          $("#turn-score-one").text(turnScore1);
        } else {
          $("ul#player-one-rolls").append("<li>Bust!</li>");
          $("#turn-score-one").text("Bust!");
          showHide("two");
          showHide("one");
          $("ul#player-one-rolls").empty();
          $("#turn-score-one").empty();

          currentTurn1.resetTurnStats();
          runningTotal1 = currentTurn1.runningTotal;
        }
      });

      $("#player-board-one button.hold").click(function(){
        playerOneHand.updateScore(turnScore1);
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
          runningTotal1 = currentTurn1.runningTotal;
        }
      });

      $("#player-board-two button.roll").click(function() {
        currentTurn2.playerRoll();
        if (currentTurn2.rollAgain === true){
          $("ul#player-two-rolls").append("<li>" + runningTotal2[0] + "</li>");
          turnScore2 = currentTurn2.sumArray();
          $("#turn-score-two").text(turnScore2);
        } else {
          $("ul#player-two-rolls").append("<li>Bust!</li>");
          $("#turn-score-two").text("Bust!");
          showHide("two");
          showHide("one");

          $("ul#player-two-rolls").empty();
          $("#turn-score-two").empty();

          currentTurn2.resetTurnStats();
          runningTotal2 = currentTurn2.runningTotal;
        }
      });

      $("#player-board-two button.hold").click(function(){
        playerTwoHand.updateScore(turnScore2);
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
          runningTotal2 = currentTurn2.runningTotal;
        }
      });
    }
  });
});
