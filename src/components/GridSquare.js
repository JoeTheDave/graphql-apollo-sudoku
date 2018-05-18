import React, { Component } from 'react';
import cx from 'classnames';
import '../css/GridSquare.css';

class GridSquare extends Component {

  onGridSquareClick = () => {
    this.props.clickHandler(this.props.squareData.id);
  };

  render() {
    const { squareData, isSelected, isRelatedToSelected } = this.props;

    return (
      <div
        key={squareData.cuid}
        className={cx('grid-square', { 'isSelected': isSelected, 'isRelatedToSelected': isRelatedToSelected })}
        onClick={this.onGridSquareClick}
      >
        {squareData.shown && <div>{squareData.number}</div>}
        {!squareData.shown && <div className="user-value">{squareData.guess}</div>}
      </div>
    );
  };

  
}

export default GridSquare;