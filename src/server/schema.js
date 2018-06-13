const fs = require('fs');
const { makeExecutableSchema } = require('graphql-tools');
const sudokuDataService = require('./sudokuDataService');

const typeDefs = fs.readFileSync('src/server/typedefs.graphql', 'utf8');
const gridSquares = sudokuDataService.generatePuzzleData();

const resolvers = {
  Query: {
    gridSquares: () => gridSquares,
  },
  Mutation: {
    setGridSquareValue: (rootObj, { gridSquareId, value }) => {
      const gridSquare = gridSquares.find((gs) => gs.id === gridSquareId);
      if (!gridSquare.shown) {
        gridSquare.guess = value;
      }
      return gridSquare;
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
