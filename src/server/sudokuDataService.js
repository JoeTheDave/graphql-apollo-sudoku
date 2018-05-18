const _ = require('lodash');
const cuid = require('cuid');

let generatePuzzleData = function () {
	let puzzleData = new SudokuData();
	puzzleData.generate();
	return puzzleData.grid;
};

class SudokuData {
  constructor () {
    this.grid = [];
  }

  generate () {
    this.createGridSquares();
    this.establishRelationships();
    this.establishDirectNeighborRelationships();
    this.populate();
    this.simplifyRelatedObjectsToIdReferences();
    this.setRevealedGridSquares()
  }

  createGridSquares () {
    for (let id = 0; id <= 80; id++) {
      this.grid.push(new GridSquare(id))
    }
  }

  establishRelationships () {
    _.each(this.grid, (gridSquare) => {
      let rowStartId = gridSquare.id - gridSquare.id % 9;
      let colStartId = gridSquare.id % 9;
      let grid3x3StartId = gridSquare.id - (gridSquare.id % 27) + (gridSquare.id % 9) - (gridSquare.id % 3);
      for (let x = 0; x <= 8; x++) {
        gridSquare.establishRelationship(this.findGridSquareById(rowStartId + x));
        gridSquare.establishRelationship(this.findGridSquareById(colStartId + (x * 9)));
        gridSquare.establishRelationship(this.findGridSquareById(grid3x3StartId + (x % 3) + (Math.floor(x / 3) * 9)));
      }
    });
  }

  establishDirectNeighborRelationships () {
    _.each(this.grid, (gridSquare) => {
      if (gridSquare.id <= 8) {
        gridSquare.upperNeighbor = this.findGridSquareById(gridSquare.id + 72);
      } else {
        gridSquare.upperNeighbor = this.findGridSquareById(gridSquare.id - 9);
      }
      if (gridSquare.id % 9 === 8) {
        gridSquare.rightNeighbor = this.findGridSquareById(gridSquare.id - 8);
      } else {
        gridSquare.rightNeighbor = this.findGridSquareById(gridSquare.id + 1);
      }
      if (gridSquare.id >= 72) {
        gridSquare.lowerNeighbor = this.findGridSquareById(gridSquare.id - 72);
      } else {
        gridSquare.lowerNeighbor = this.findGridSquareById(gridSquare.id + 9);
      }
      if (gridSquare.id % 9 === 0) {
        gridSquare.leftNeighbor = this.findGridSquareById(gridSquare.id + 8);
      } else {
        gridSquare.leftNeighbor = this.findGridSquareById(gridSquare.id - 1);
      }
    });
  }

  populate () {
    let populationCycles = 0;
    while(this.hasUnpopulatedGridSquares()) {
      let gridSquare = this.getRandomUndefinedGridSquare();
      gridSquare.populate();
      populationCycles++;
      if (populationCycles >= 200) {
        this.clearRandomGridSquares(20);
        populationCycles -= 100;
      }
    }
  }

  findGridSquareById (id) {
    return _.find(this.grid, (gridSquare) => {
      return gridSquare.id === id;
    });
  }

  hasUnpopulatedGridSquares () {
    return this.getUndefinedGridSquares().length !== 0;
  }

  getUndefinedGridSquares () {
    return _.filter(this.grid, (gridSquare) => {
      return gridSquare.number === null;
    });
  }

  getRandomUndefinedGridSquare () {
    let undefinedGridSquares = this.getUndefinedGridSquares();
    if (undefinedGridSquares.length > 0) {
      let randomIndex = _.random(undefinedGridSquares.length - 1);
      return undefinedGridSquares[randomIndex];
    }
    return null;
  }

  clearRandomGridSquares (numberToClear) {
    let populatedGridSquares = _.difference(this.grid, this.getUndefinedGridSquares());
    let gridSquaresToClear = _.take(_.shuffle(populatedGridSquares), numberToClear);
    _.each(gridSquaresToClear, (gridSquare) => {
      gridSquare.number = null;
    });
  }

  simplifyRelatedObjectsToIdReferences () {
    _.each(this.grid, (gridSquare) => {
      gridSquare.leftNeighbor = gridSquare.leftNeighbor.id;
      gridSquare.upperNeighbor = gridSquare.upperNeighbor.id;
      gridSquare.rightNeighbor = gridSquare.rightNeighbor.id;
      gridSquare.lowerNeighbor = gridSquare.lowerNeighbor.id;
      gridSquare.relationships = _.sortBy(_.map(gridSquare.relationships, 'id'));
    });
  };

  setRevealedGridSquares () {
    const revealedSquareIds = _.chain(this.grid).shuffle().take(35).map('id').value();
    _.forEach(this.grid, (gridSquare) => {
      gridSquare.shown = _.includes(revealedSquareIds, gridSquare.id);
      return gridSquare;
    })
  }
	
};

class GridSquare {
  constructor (id) {
    this.cuid = cuid();
    this.id = id;
    this.number = null;
    this.relationships = [];
    this.upperNeighbor = null;
    this.rightNeighbor = null;
    this.lowerNeighbor = null;
    this.leftNeighbor = null;
    this.shown = false;
    this.guess = null;
  }

  establishRelationship (relatedGridSquare) {
    if((!this.alreadyHasRelationship(relatedGridSquare)) && this.id !== relatedGridSquare.id) {
      this.relationships.push(relatedGridSquare);
    }
  }

  alreadyHasRelationship (relatedGridSquare) {
    return _.includes(this.relationships, relatedGridSquare);
  }

  populate () {
    let sequence = this.generateRandomSequence();
    while (this.number === null && sequence.length > 0) {
      let candidate = sequence.pop();
      if (this.isValidNumber(candidate)) {
        this.number = candidate;
      }
    }
    if (this.number === null) {
      this.forcePopulate();
    }
  }

  generateRandomSequence () {
    return _.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }

  isValidNumber (number) {
    return this.calculateCandidateConflicts(number) === 0;
  }

  calculateCandidateConflicts (number) {
    return _.filter(this.relationships, (relatedGridSquare) => {
      return relatedGridSquare.number === number;
    }).length;
  }

  forcePopulate () {
    let number = this.findNumberWithFewestConflicts();
    this.elmininateConflictsForNumber(number);
    this.number = number;
  }

  elmininateConflictsForNumber (number) {
    _.each(this.relationships, (relatedGridSquare) => {
      if (relatedGridSquare.number === number) {
        relatedGridSquare.number = null;
      }
    });
  }

  findNumberWithFewestConflicts () {
    let conflictSummary = [];
    _.each(this.generateRandomSequence(), (number) => {
      conflictSummary.push({ number: number, conflicts: this.calculateCandidateConflicts(number) });
    });
    let sortedConflictSummary = _.sortBy(conflictSummary, (conflictSummaryItem) => {
      return conflictSummaryItem.conflicts;
    });
    let test = _.first(sortedConflictSummary);
    return test.number;
  }

};

module.exports = {
	generatePuzzleData: generatePuzzleData
};