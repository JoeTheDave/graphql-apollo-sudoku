import React, { Component } from 'react';
import { includes } from 'lodash';
import GridSquare from './GridSquare';
import '../css/Grid.css';

class App extends Component {
  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const selectedGridSquare = this.props.gridSquares.find(_ => _.id === this.props.selectedGridSquareId);
      if (!selectedGridSquare) { return; }

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
      if (!isNaN(event.key) && parseInt(event.key) !== 0) {
        this.props.setGridSquareValue({
          variables: {
            gridSquareId: selectedGridSquare.id,
            value: parseInt(event.key),
          }
        });
      }
      if (event.code === 'Space' || event.code === 'Backspace') {
        this.props.setGridSquareValue({
          variables: {
            gridSquareId: selectedGridSquare.id,
            value: null,
          }
        });
      }
    })
  }

  isRelatedToSelected(gridSquareId) {
    const { gridSquares, selectedGridSquareId } = this.props;
    return includes(
      (gridSquares.find(_ => _.id === selectedGridSquareId) || {}).relationships || [],
      gridSquareId,
    )
  }

  render() {
    const { gridSquares, selectedGridSquareId, selectGridSquare } = this.props;
    return (
      <div className="grid-container">
        {(gridSquares || []).map((gridSquare) => {
          return (
            <GridSquare
              key={gridSquare.cuid}
              squareData={gridSquare}
              clickHandler={selectGridSquare}
              isSelected={selectedGridSquareId === gridSquare.id}
              isRelatedToSelected={this.isRelatedToSelected(gridSquare.id)}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
