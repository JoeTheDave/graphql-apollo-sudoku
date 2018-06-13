import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import '../css/GridSquare.css';

class GridSquare extends Component {
  static propTypes = {
    clickHandler: PropTypes.func.isRequired,
    squareData: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isRelatedToSelected: PropTypes.bool.isRequired,
    isOptimistic: PropTypes.bool.isRequired,
  };

  onGridSquareClick = () => {
    this.props.clickHandler(this.props.squareData.id);
  };

  render() {
    const {
      squareData,
      isSelected,
      isRelatedToSelected,
      isOptimistic,
    } = this.props;
    const className = cx('grid-square', { isSelected, isRelatedToSelected });
    return (
      <div
        key={squareData.cuid}
        className={className}
        onClick={this.onGridSquareClick}
      >
        {squareData.shown && <div>{squareData.number}</div>}
        {!squareData.shown && (
          <div
            className={cx('user-value', {
              isOptimistic,
              isWrong:
                squareData.guess && squareData.number !== squareData.guess,
            })}
          >
            {squareData.guess}
          </div>
        )}
      </div>
    );
  }
}

export default GridSquare;
