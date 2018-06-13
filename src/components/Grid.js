import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import GridSquare from './GridSquare';
import '../css/Grid.css';

const isOptimistic = (object, cacheInstance) =>
  cacheInstance.optimistic.some(
    (transaction) =>
      transaction.data[`${object.__typename}:${object.id}`] != null,
  );

class Grid extends Component {
  static propTypes = {
    gridSquares: PropTypes.array.isRequired,
    selectedGridSquareId: PropTypes.number,
    selectGridSquare: PropTypes.func.isRequired,
    setGridSquareValue: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  };

  static defaultProps = {
    selectedGridSquareId: null,
  };

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const selectedGridSquare = this.props.gridSquares.find(
        (gs) => gs.id === this.props.selectedGridSquareId,
      );
      if (!selectedGridSquare) {
        return;
      }

      switch (event.code) {
        case 'ArrowUp':
          this.props.selectGridSquare(selectedGridSquare.upperNeighbor);
          break;
        case 'ArrowRight':
          this.props.selectGridSquare(selectedGridSquare.rightNeighbor);
          break;
        case 'ArrowDown':
          this.props.selectGridSquare(selectedGridSquare.lowerNeighbor);
          break;
        case 'ArrowLeft':
          this.props.selectGridSquare(selectedGridSquare.leftNeighbor);
          break;
        default:
          break;
      }
      if (+event.key) {
        this.props.setGridSquareValue({
          optimisticResponse: {
            __typename: 'Mutation',
            setGridSquareValue: {
              __typename: 'GridSquare',
              cuid: selectedGridSquare.cuid,
              id: selectedGridSquare.id,
              guess: parseInt(event.key, 10),
            },
          },
          variables: {
            gridSquareId: selectedGridSquare.id,
            value: parseInt(event.key, 10),
          },
        });
      }
      if (event.code === 'Space' || event.code === 'Backspace') {
        this.props.setGridSquareValue({
          variables: {
            gridSquareId: selectedGridSquare.id,
            value: null,
          },
        });
      }
    });
  }

  isRelatedToSelected(gridSquareId) {
    const { gridSquares, selectedGridSquareId } = this.props;
    return includes(
      (gridSquares.find((_) => _.id === selectedGridSquareId) || {})
        .relationships || [],
      gridSquareId,
    );
  }

  render() {
    const {
      gridSquares,
      selectedGridSquareId,
      selectGridSquare,
      client,
    } = this.props;
    return (
      <div className="grid-container">
        {(gridSquares || []).map((gridSquare) => (
          <GridSquare
            key={gridSquare.cuid}
            squareData={gridSquare}
            clickHandler={selectGridSquare}
            isSelected={selectedGridSquareId === gridSquare.id}
            isRelatedToSelected={this.isRelatedToSelected(gridSquare.id)}
            isOptimistic={isOptimistic(gridSquare, client.cache)}
          />
        ))}
      </div>
    );
  }
}

export default Grid;
