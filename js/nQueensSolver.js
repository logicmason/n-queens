var solveNQueens = function(n){
  var solution = [];

  var populateFalse = function(n) {
    return _.times(n, function(x) {
      return _.times(n, function() { return false; });
    })
  };

  var solution = populateFalse(n);

  var quickSolve = function (n) {
    //Generates a solution in linear time
    for (var i = 0; i < n/2; i++) {
      if ( _([0,1,4,5]).contains(n % 6) ) {
        //Easy solution for n mod 6 not 2 or 3
        //Wrap the board in knight moves twice
        if ((i+1)*2-1 < n) { 
          solution[i][((i+1)*2)-1] = true;
        }

        if (i*2 < n){
          solution[i+Math.floor(n/2)][i*2] = true;
        }
      }


      if ((n % 6 === 2) || (n % 6 === 3)) {
        if (n % 6 === 3) {
          solution = quickSolve(n-1); //treat as board 1 size smaller
          solution[n-1][n-1] = true;  //then add a queen in the corner
          return solution;
        }
        
        //knight moves from center bottom, going left and up
        //the (n + stuff) % n calculation causes horizontal wrap
        if (Math.floor(n/2)-i*2 < n) {
          solution[i][(n + Math.floor(n/2)-i*2) % n] = true;
        } 
        //knight moves from center top, going right and down
        if ((n-i) >= 0)
          solution[n-i-1][(n+ Math.floor(n/2)-1+i*2) % n] = true;
      }
    }
    return solution;
  }

  var brutishSolve = function (n) {
    var solution = [];
    for (var row = 0; row < n; row++) {
      for (var col = 0; col < n; col++) {
        //brute force solution not implemented
      }
    }
  }

  solution = quickSolve(n);
  window.chessboardView.model.setSimpleBoard(solution);
  return solution;
}
