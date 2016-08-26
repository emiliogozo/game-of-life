import React from 'react';
import ReactDOM from 'react-dom';

import omit from 'lodash/omit';
import reject from 'lodash/reject';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

import Style from './main.scss';

class Main extends React.Component {
  render() {
    return (
      <div>
        <Board />
      </div>
    );
  }
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      numCol: 70,
      numRow: 50,
      speed: 10000,
      generation: 0,
      aliveArr: []
    };
  }
  componentDidMount() {
    this._initCellStatus();
  }
  render() {
    return (
      <div className='board'>
        <div className='control-top'>
          <button id='run-btn' className='btn' onClick={ () => this._startAnimation() }>Run</button>
          <button id='pause-btn' className='btn' onClick={ () => this._pauseAnimation() }>Pause</button>
          <button id='clear-btn' className='btn' onClick={ () => this._clearBoard() }>Clear</button>
          <span className='counter-label'>Generation: </span><span className='counter'>{this.state.generation}</span>
        </div>
        <div className={'cell-container cell-container-' + this.state.numCol + 'x' + this.state.numRow}>
          { this._generateCells() }
        </div>
        <div className='control-bottom'>
          <div className='control-size'>
            <span className='control-label'>Board Size: </span>
            <button id='size-50x30-btn' className='btn' onClick={(ev) => this._changeSize(ev) } value='50x30'>50x30</button>
            <button id='size-70x50-btn' className='btn' onClick={(ev) => this._changeSize(ev) } value='70x50'>70x50</button>
            <button id='size-100x80-btn' className='btn' onClick={(ev) => this._changeSize(ev) } value='100x80'>100x80</button>
          </div>
          <div className='control-speed'>
            <span className='control-label'>Sim Speed: </span>
            <button id='speed-slow-btn' className='btn'>Slow</button>
            <button id='speed-medium-btn' className='btn'>Medium</button>
            <button id='speed-faxt-btn' className='btn'>Fast</button>
          </div>
        </div>
      </div>
    );
  }
  _initCellStatus() {
    var cellStats = [];
    var cols = this.state.numCol;
    var rows = this.state.numRow;
    var row = [];
    while (cols--) row.push(false);
    while (rows--) cellStats.push(row.slice());
    this.setState({
      generation: 0,
      cellIsAlive: cellStats
    });
  }
  _getNeighbors(cell) {
    const {i, j} = cell;
    const cols = this.state.numCol;
    const rows = this.state.numRow;
    var nbArr = [
      { i: i + 1, j: j - 1 }, { i: i + 1, j: j }, { i: i + 1, j: j + 1 }, { i: i, j: j + 1 },
      { i: i - 1, j: j + 1 }, { i: i - 1, j: j }, { i: i - 1, j: j - 1 }, { i: i, j: j - 1 }
    ];
    return nbArr.filter(nb =>
      ((nb.i >= 0) && (nb.i < rows) && (nb.j >= 0) && (nb.j < cols)));
  }
  _isAlive(cell) {
    return filter(this.state.aliveArr, cell).length === 1;
  }
  _updateCellStatus() {
    var aliveArr = this.state.aliveArr;
    var newAliveArr = [];
    newAliveArr = uniqWith(flatten(aliveArr.map(alive =>
      [alive].concat(this._getNeighbors(alive))
    )), isEqual).map(cell => {
      var nbArr = this._getNeighbors(cell);
      var count = nbArr
        .map(nb => this._isAlive(nb) ? 1 : 0)
        .reduce((a, b) => a + b, 0);
      var newAliveSubArr = [];
      if (count === 3) {
        newAliveSubArr.push(cell);
      } else if (count === 2 && this._isAlive(cell)) {
        newAliveSubArr.push(cell);
      }
      return newAliveSubArr;
    });
    newAliveArr = flatten(newAliveArr);

    this.setState({
      generation: this.state.generation + 1,
      aliveArr: newAliveArr
    });
  }
  _generateCells() {
    var cells = [];
    for (var i = 0; i < this.state.numRow; i++) {
      for (var j = 0; j < this.state.numCol; j++) {
        let cellName = i < 10 ? '0' + i : '' + i;
        cellName += j < 10 ? '0' + j : '' + j;
        cells.push(
          <Cell name={cellName}
            rowIndex={i} colIndex={j}
            generation={this.state.generation}
            onStateChange={ obj => this._onCellStateChange(obj) }
            isAlive={this._isAlive({i: i, j: j})}
            key={cellName} />
        );
      }
    }
    return cells;
  }
  /**
   * Start the animation by running a setInterval instance
   */
  _startAnimation() {
    this.interval = setInterval(() => {
      this._updateCellStatus();
    }, this.speed);
  }
  /**
   * Halts the animation by stopping the counter
   */
  _pauseAnimation() {
    clearInterval(this.interval);
  }
  /**
   * Clears the board and resets the counter to zero
   * TODO: clearing the board
   */
  _clearBoard() {
    this._pauseAnimation();
    this._initCellStatus();
  }
  _changeSize(ev) {
    const [numCol, numRow] = ev.target.value.split('x').map(val => parseInt(val));
    this.setState({
      numCol: numCol,
      numRow: numRow
    });
  }
  _onCellStateChange(obj) {
    if (obj.isAlive) {
      this.state.aliveArr.push(omit(obj, 'isAlive'));
    } else {
      this.state.aliveArr = reject(this.state.aliveArr, omit(obj, 'isAlive'));
    }
  }
}

class Cell extends React.Component {
  constructor() {
    super();
    this.state = {
      className: 'cell'
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.isAlive) {
      if (!this._isAlive(this.state.className)) {
        this.setState({
          className: 'cell new-born'
        });
      } else if (this._isNewBorn(this.state.className)) {
        this.setState({
          className: 'cell alive'
        });
      }
    } else {
      this.setState({
        className: 'cell'
      });
    }
  }
  render() {
    return (
      <div
        id={this.props.name}
        className={this.state.className}
        onClick={(ev) => this._onClick(ev) }>
      </div>
    );
  }
  _onClick(ev) {
    var className = ev.target.className;
    var isAlive = this._isAlive(className);
    if (!isAlive) {
      className += ' new-born';
    } else {
      className = 'cell';
    }
    this.setState({
      alive: !isAlive,
      newBorn: true,
      className: className
    });
    this.props.onStateChange({
      i: this.props.rowIndex,
      j: this.props.colIndex,
      isAlive: !isAlive
    });
  }
  _isAlive(className) {
    return /alive/.test(className) || /new\-born/.test(className);
  }
  _isNewBorn(className) {
    return /new\-born/.test(className);
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);