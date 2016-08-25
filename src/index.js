import React from 'react';
import ReactDOM from 'react-dom';

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
      cellIsAlive: []
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
  _updateCellStatus() {
    var cellStats = this.state.cellIsAlive;
    var cols = this.state.numCol;
    var rows = this.state.numRow;
    var newCellStats = JSON.parse(JSON.stringify(cellStats));
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var nb = [
          [i + 1, j - 1], [i + 1, j], [i + 1, j + 1], [i, j + 1],
          [i - 1, j + 1], [i - 1, j], [i - 1, j - 1], [i, j - 1]
        ];
        nb = nb.filter(idx =>
          ((idx[0] >= 0) && (idx[0] < rows) && (idx[1] >= 0) && (idx[1] < cols)));
        var count = nb.map(idx => cellStats[idx[0]][idx[1]] ? 1 : 0)
          .reduce((a, b) => a + b, 0);
        if (count === 3) {
          newCellStats[i][j] = true;
        } else if ((count < 2) || (count > 3)) {
          newCellStats[i][j] = false;
        }
      }
    }
    this.setState({
      generation: this.state.generation + 1,
      cellIsAlive: newCellStats
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
            onStateChange={obj => this._onCellStateChange(obj) }
            isAlive={this.state.cellIsAlive[i] && this.state.cellIsAlive[i][j]}
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
    this.state.cellIsAlive[obj.rowIndex][obj.colIndex] = obj.isAlive;
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
      rowIndex: this.props.rowIndex,
      colIndex: this.props.colIndex,
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