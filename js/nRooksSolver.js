var solveNRooks = function(n, options){
  //naive solution- rooks on the diagonal
  var solution = [];
  for (var i = 0; i < n; i++) {
    var row = [];
    for (var j = 0; j < n; j++) {
      if (i === j) {
        row.push(true);
      } else {
        row.push(false);
      }
    }
    solution.push(row);
  }

  var allSolutions = _.memoize(function(n) {
    //Base cases
    if (!n) return [];
    if (n === 1) return [[[true]]];

    //Inductive step
    var solutions = [];
    for (var i = 0; i < n; i++) {
      _.each(allSolutions(n-1), function(nMinusOneSolution){
        solutions.push(generateSolution(nMinusOneSolution, i));
      });
    }
    return solutions;
  });

  var generateSolution = function(nMinusOneSolution, i) {
    //Takes in a solution for size n-1 and generates a solution for size n 
    //For every size n-1 solution there are n solutions of size n
    //This function returns the "i"th solution of those n possible solutions
    var n = nMinusOneSolution.length + 1;
    var newSet = [];
    for (var j = 0; j < n-1; j++) {
      var row = nMinusOneSolution[j];
      newSet.push(row.slice(0).concat(false)); //append empty square to every row
    }
    newSet.splice(i,0, makeTrueEndingRow(n)); //insert new rook ending row
    return newSet;
  }

  var makeTrueEndingRow = function(x) {
    var row = _.times(x-1, function(y) { return false; });
    row.push(true);
    return row;
  }


  // this line hooks into the visualizer
  window.chessboardView.model.setSimpleBoard(solution, {'gameType':'rooks'});
  if (options && options['all']) { 
    var all = allSolutions(n);
    var randomNumber = [Math.floor(Math.random()*all.length)];
    window.chessboardView.model.setSimpleBoard(all[randomNumber], {'gameType':'rooks'});
    console.log("Displaying solution #" + randomNumber);
    return all;
  }
  return solution;
}
