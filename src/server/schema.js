const fs = require('fs');
const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const cuid = require('cuid');
const sudokuDataService = require('./sudokuDataService');

const typeDefs = fs.readFileSync('src/server/typedefs.graphql', 'utf8');
const gridSquares = sudokuDataService.generatePuzzleData();

const resolvers = {
  Query: {
    gridSquares: () => gridSquares,
  },
  Mutation: {
    setGridSquareValue: (_, { gridSquareId, value }) => { // What's the underscore doing here?
      const gridSquare = gridSquares.find(_ => _.id === gridSquareId);
      if (!gridSquare.shown) {
        gridSquare.guess = value;
      }

      return gridSquare;
    }
  }
}

module.exports = makeExecutableSchema({ typeDefs, resolvers });
