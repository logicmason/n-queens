(function(){

  var ChessboardModel = Backbone.Model.extend({
    initialize: function(params){
      if (params.n) {
        this.clearPieces();
      } else {
        this.setSimpleBoard(params.board);
      }
    },

    clearPieces: function(){
      this.set('board', this.makeEmptyBoard());
    },

    setSimpleBoard: function(simpleBoard, params){
      if (params && params.gameType) {
        this.set('gameType', params.gameType);
      } else {
        this.set('gameType', 'queens');
      }
      this.set('board', this.makeBoardFromSimpleBoard(simpleBoard));
      this.set('n', this.get('board').length);
    },

    makeBoardFromSimpleBoard: function(simpleBoard){
      var that = this;
      return _.map(simpleBoard, function(cols, r){
        return _.map(cols, function(hasPiece, c){
          return {
            row: r,
            col: c,
            piece: hasPiece,
            gameType: that.get('gameType'),
            sign: ((r+c)%2),
            inConflict: function(){
              // todo: how expensive is this inConflict() to compute?
              if (this.gameType === 'rooks') {
                              return (
                that.hasRowConflictAt(r) ||
                that.hasColConflictAt(c) 
                );
              } else {
                return (
                  that.hasRowConflictAt(r) ||
                  that.hasColConflictAt(c) ||
                  that.hasUpLeftConflictAt(that._getUpLeftIndex(r, c)) ||
                  that.hasUpRightConflictAt(that._getUpRightIndex(r, c))
                );
              }
            },
          };
        }, this);
      }, this);
    },

    makeEmptyBoard: function(){
      var board = [];
      _.times(this.get('n'), function(){
        var row = [];
        _.times(this.get('n'), function(){
          row.push(false);
        }, this);
        board.push(row);
      }, this);
      return this.makeBoardFromSimpleBoard(board);
    },

    // we want to see the first row at the bottom, but html renders things from top down
    // So we provide a reversing function to visualize better
    reversedRows: function(){
      return _.extend([], this.get('board')).reverse();
    },

    togglePiece: function(r, c){
      this.get('board')[r][c].piece = !this.get('board')[r][c].piece;
      this.trigger('change');
    },

    _getUpLeftIndex: function(r, c){
      return r + c;
    },

    _getUpRightIndex: function(r, c){
      return this.get('n') - c + r - 1;
    },


    hasRooksConflict: function(){
      return this.hasAnyRowConflict() || this.hasAnyColConflict();
    },

    hasQueensConflict: function(){
      return this.hasRooksConflict() || this.hasAnyUpLeftConflict() || this.hasAnyUpRightConflict();
    },

    _isInBounds: function(r, c){
      return 0 <= r && r < this.get('n') && 0 <= c && c < this.get('n');
    },


    // todo: fill in all these functions - they'll help you!

    hasAnyRowConflict: function(){
      for (var row = 0; row < this.get('n'); row++) {
        if (this.hasRowConflictAt(row)) {
          return true;
        }
      }
      return false;
    },

    hasRowConflictAt: function(r){
      var row = this.get('board')[r];
      var piecesInRow = 0;
      for (var i = 0; i < row.length; i++) {
        piecesInRow += row[i].piece;
        if (piecesInRow > 1) { return true; }
      }
      return false;
    },

    hasAnyColConflict: function(){
      for (var col = 0; col < this.get('n'); col++) {
        if (this.hasColConflictAt(col)) {
          return true;
        }
      }
      return false;
    },

    hasColConflictAt: function(c){
      var len = this.get('board')[0].length;
      piecesInCol = 0;
      for (var i = 0; i < len; i++) {
        piecesInCol += this.get('board')[i][c].piece;
        if (piecesInCol > 1) { return true; }
      }
      return false;
    },

    hasAnyUpLeftConflict: function(){
      var maxULI = (this.get('n') -1) * 2;
      for (var upLeftIndex = 0; upLeftIndex < maxULI; upLeftIndex++) {
        if (this.hasUpLeftConflictAt(upLeftIndex)) {
          return true;
        }
      }
      return false;
    },

    hasUpLeftConflictAt: function(upLeftIndex){
      var pieces = 0;
      var n = this.get('board')[0].length;
      for (var row = 0, col = upLeftIndex; (row < n) && (col >= 0); row++, col--) {
        if (col < n) { pieces += this.get('board')[row][col].piece; }
        if (pieces > 1) { return true; }
      }
      return false;
    },

    hasAnyUpRightConflict: function(){
      var maxURI = (this.get('n') -1) * 2;
      for (var upRightIndex = 0; upRightIndex < maxURI; upRightIndex++) {
        if (this.hasUpRightConflictAt(upRightIndex)) {
          return true;
        }
      }
      return false;
    },

    hasUpRightConflictAt: function(upRightIndex){
      var pieces = 0;
      var n = this.get('board')[0].length;
      for (var row = 0; row < n; row++) {
        for (var col = 0; col < n; col++) {
          if ( (n - col + row - 1 == upRightIndex) && 
             (this.get('board')[row][col].piece) ){
            pieces++;
            if (pieces > 1) { return true; }
          }
        }
      }        
      return false;
    },

    pieceChar: function() {
      if (this.gameType === 'rooks') { 
        return String.fromCharCode(9814); 
      } else {
        return String.fromCharCode(9813); // queens
      }
    }
  });

  this.ChessboardModel = ChessboardModel;

}());
