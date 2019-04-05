/*Each square in the board has an id tag; the variables 'board' and 'wins' refer to these.
  The wins array lists every possible win condition.
  When a square is clicked, the .x or .o css class (determined by the switch) is applied
  to make it that shape and flip it over. The board is then checked for a player win.
  On the computer's move, first it checks for a win. It takes the first possible win
  it finds. Next it checks whether the player is about to win; if so, it blocks. If
  neither of those are true, the next unmarked square is taken.
  When a new game is started, the board array is shuffled. The checks above loop
  through the array and check each square.
  The toggleSwitch flips the values of xo (player) and comp_xo. It is disabled when
  a square is clicked and re-enabled when the board resets.
  The setTimeout function is used to wait for the flip animation to finish.
  The pointerEvents are set to none when it isn't the player's turn.
  TODO: let computer go first; add some gradients; O's don't show up right on some browsers.
*/

var board = ["aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc"];

var wins = {"aa": [["ab", "ac"], ["bb", "cc"], ["ba", "ca"]],
            "ab": [["aa", "ac"], ["bb", "cb"]],
            "ac": [["aa", "ab"], ["bb", "ca"], ["bc", "cc"]],
            "ba": [["aa", "ca"], ["bb", "bc"]],
            "bb": [["aa", "cc"], ["ca", "ac"], ["ab", "cb"], ["ba", "bc"]],
            "bc": [["ac", "cc"], ["ba", "bb"]],
            "ca": [["aa", "ba"], ["bb", "ac"], ["cb", "cc"]],
            "cb": [["ab", "bb"], ["ca", "cc"]],
            "cc": [["aa", "bb"], ["ca", "cb"], ["ac", "bc"]]
            };

var Reset = false;
var cssTrns = 1000; //square spin duration
var xo = 'x';
var comp_xo = 'o';

$('.outer').on('click', function() {
  Reset = false;
  $("#slider").prop('disabled', true); //disable the x-o switch when you start
  document.getElementById('slider').style.pointerEvents = 'none'; //
  if($(this).hasClass(xo) || $(this).hasClass(comp_xo)) return; //If it's already an x or o, return
  $(this).addClass(xo);
  if(xo == 'o') $(this).addClass('o-border');
  $(this).toggleClass('active');
  document.getElementById($(this).attr("id")).style.pointerEvents = 'none';
  if(check_your_move($(this).attr("id"))) {
    disable();
    setTimeout(function() { //Wait for the your-move spin to stop before alert/reset
      alert("You win.");
      reset();
    }, cssTrns);
    return;
  }
  if(!Reset) {
    //turn pointerEvents off so you can only click one square on your turn
    board.forEach(function(square) {
        document.getElementById(square).style.pointerEvents = 'none';
    });
    //You could also wait for the css animation to end. I thought it was simpler to
    //do it this way.
    setTimeout(function() {
      switch(comp_move()) {
        case 1:
          disable();
          setTimeout(function() { //Wait for the computer-move spin to stop before alert/reset
            alert("Computer wins.");
            reset();
          }, cssTrns);
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          alert("Draw");
          reset();
          break;
      }
    }, cssTrns);
    //turn pointerEvents back on when flip finishes
    setTimeout(function() {
      board.forEach(function(square) {
        if(!$('#'+square).hasClass('x') && !$('#'+square).hasClass('o')) document.getElementById(square).style.pointerEvents = 'auto';
      });
    }, cssTrns);
  }
});

function toggleSwitch() {
  if(document.getElementById('slider').style.pointerEvents == 'none') {
    return;
  }
  if(xo == 'x') {
    xo = 'o';
    comp_xo = 'x';
  } else {
    xo = 'x';
    comp_xo = 'o';
  }
  //console.log(xo);
  //console.log(Reset);
}

//reset board
function reset() {
  board.forEach(function(square) {
    document.getElementById(square).style.pointerEvents = 'auto';
    if($('#'+square).hasClass("x")) $('#'+square).removeClass("x");
    if($('#'+square).hasClass("o")) {
      $('#'+square).removeClass("o");
      $('#'+square).removeClass('o-border');
    }
    if($('.outer').hasClass('active')) $('.outer').removeClass('active');
  });
  Reset = true;
  shuffle_wrapper(); //so the computer's first move will be different next time
  $("#slider").prop('disabled', false); //re-enable x-o switch
  document.getElementById('slider').style.pointerEvents = 'auto'; //
}

function comp_move() {
  var len_board = board.length;
  //Loop through squares to check for winning move.
  //Can't use foreach or for-in because it needs to break/return.
  for(var i = 0; i < len_board; ++i) {
    var len_rows = wins[board[i]].length;
    for(var j = 0; j < len_rows; ++j) {
      //did the computer win?
      if(!$('#'+board[i]).hasClass("x") &&
         !$('#'+board[i]).hasClass("o") &&
         $('#'+wins[board[i]][j][0]).hasClass(comp_xo) &&
         $('#'+wins[board[i]][j][1]).hasClass(comp_xo)) {
        document.getElementById(board[i]).style.pointerEvents = 'none';
        $('#'+board[i]).addClass(comp_xo);
        if(comp_xo == 'o') $('#'+board[i]).addClass('o-border');
        $('#'+board[i]).toggleClass('active');
          //$('.outer').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
        return 1;
      }
    }
  }

  //loop again to try to block winning move
  for(var i = 0; i < len_board; ++i) {
    var len_rows = wins[board[i]].length;
    for(var j = 0; j < len_rows; ++j) {
      if(!$('#'+board[i]).hasClass("x") &&
         !$('#'+board[i]).hasClass("o") &&
         $('#'+wins[board[i]][j][0]).hasClass(xo) &&
         $('#'+wins[board[i]][j][1]).hasClass(xo)) {
        document.getElementById(board[i]).style.pointerEvents = 'none';
        $('#'+board[i]).addClass(comp_xo);
        if(comp_xo == 'o') $('#'+board[i]).addClass('o-border');
        $('#'+board[i]).toggleClass('active');
        console.log("true2");
        //$('.outer').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
        return 2;
      }
    }
  }

  //loop again for normal move
  for(var i = 0; i < len_board; ++i) {
    var len_rows = wins[board[i]].length;
    for(var j = 0; j < len_rows; ++j) {
      if(!$('#'+board[i]).hasClass("x") && !$('#'+board[i]).hasClass("o")) {
        document.getElementById(board[i]).style.pointerEvents = 'none';
        $('#'+board[i]).addClass(comp_xo);
        if(comp_xo == 'o') $('#'+board[i]).addClass('o-border');
        $('#'+board[i]).toggleClass('active');

        return 4;
      }
    }
  }
  //draw
  return 5;
}

//did you win?
function check_your_move(id) {
  var len = wins[id].length;
  for(var i = 0; i < len; ++i) {
    if($('#'+wins[id][i][0]).hasClass(xo) && $('#'+wins[id][i][1]).hasClass(xo)) return true;
  }
  return false;
}

//disable all buttons
function disable() {
  board.forEach(function(square) {
    document.getElementById(square).style.pointerEvents = 'none';
  });
}

function shuffle_wrapper() {
  board = shuffle(board);
}

//shuffle array
function shuffle(arr) {
  var curIndex = arr.length, tempValue, randIndex;
  while (curIndex !== 0) {
    randIndex = Math.floor(Math.random() * curIndex);
    curIndex--;
    tempValue = arr[curIndex];
    arr[curIndex] = arr[randIndex];
    arr[randIndex] = tempValue;
  }
  return arr;
}
