import React from 'react';

import Cell from './Cell';

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      numCol: 70,
      numRow: 50,
      delay: 100,
      generation: 0,
      aliveArr: []
    };
  }
  onCellClick(ev) {
    if (!this.isAlive(ev.target.id)) {
      this.state.aliveArr.push(ev.target.id);
    } else {
      this.state.aliveArr = this.state.aliveArr.filter(id => id !== ev.target.id);
    }
  }
  getNeighbors(id) {
    const { i, j } = this.getCellIndex(id);
    const cols = this.state.numCol;
    const rows = this.state.numRow;
    const nbArr = [
      { i: i + 1, j: j - 1 }, { i: i + 1, j }, { i: i + 1, j: j + 1 }, { i, j: j + 1 },
      { i: i - 1, j: j + 1 }, { i: i - 1, j }, { i: i - 1, j: j - 1 }, { i, j: j - 1 }
    ];
    return nbArr.filter(nb =>
      ((nb.i >= 0) && (nb.i < rows) && (nb.j >= 0) && (nb.j < cols)))
      .map((cell) => this.cellIndexToId(cell));
  }
  getCellIndex(id) {
    const n = parseInt(id, 10);
    const i = n % this.state.numCol;
    const j = Math.floor(n / this.state.numCol);
    return ({ i, j });
  }
  isAlive(id) {
    return this.state.aliveArr.indexOf(id) !== -1;
  }
  changeSize(ev) {
    const [numCol, numRow] = ev.target.value.split('x').map(val => parseInt(val, 10));
    this.setState({ numCol, numRow });
  }
  /**
   * Clears the board and resets the counter to zero
   * TODO: clearing the board
   */
  clearBoard() {
    this.pauseAnimation();
    this.initCellStatus();
  }
  /**
   * Halts the animation by stopping the counter
   */
  pauseAnimation() {
    clearInterval(this.interval);
  }
  /**
   * Start the animation by running a setInterval instance
   */
  startAnimation() {
    this.interval = setInterval(() => {
      this.updateCellStatus();
    }, this.delay);
  }
  updateCellStatus() {
    const aliveArr = this.state.aliveArr;
    let newAliveArr = [];
    newAliveArr = aliveArr.map(alive =>
      [alive].concat(this.getNeighbors(alive))
    );
    newAliveArr = [].concat(...newAliveArr);
    newAliveArr = [...new Set(newAliveArr)];
    newAliveArr = newAliveArr.map(cell => {
      const nbArr = this.getNeighbors(cell);
      const count = nbArr
        .map(nb => (this.isAlive(nb) ? 1 : 0))
        .reduce((a, b) => a + b, 0);
      const newAliveSubArr = [];
      if (count === 3) {
        newAliveSubArr.push(cell);
      } else if (count === 2 && this.isAlive(cell)) {
        newAliveSubArr.push(cell);
      }
      return newAliveSubArr;
    });
    newAliveArr = [].concat(...newAliveArr);

    this.setState({
      generation: this.state.generation + 1,
      aliveArr: newAliveArr
    });
  }
  initCellStatus() {
    this.setState({
      generation: 0,
      aliveArr: []
    });
  }
  cellIndexToId(cell) {
    return ((cell.j * this.state.numCol) + cell.i).toString();
  }
  render() {
    let cells = [...new Array(this.state.numRow * this.state.numCol)]
      .map((val, n) => {
        return (
          <Cell
            id={n} key={n}
            onClick={ev => this.onCellClick(ev)}
            isAlive={this.isAlive(n.toString())}
          />);
      });
    return (
      <div className="board">
        <div className="control-top">
          <button id="run-btn" className="btn" onClick={() => this.startAnimation()}>
          Run</button>
          <button id="pause-btn" className="btn" onClick={() => this.pauseAnimation()}>
          Pause</button>
          <button id="clear-btn" className="btn" onClick={() => this.clearBoard()}>
          Clear</button>
          <span className="counter-label">Generation: </span>
          <span className="counter">{this.state.generation}</span>
        </div>
        <div className={`cell-container cell-container-${this.state.numCol}x${this.state.numRow}`}>
          { cells }
        </div>
        <div className="control-bottom">
          <div className="control-size">
            <span className="control-label">Board Size: </span>
            <button
              id="size-50x30-btn"
              className="btn" onClick={(ev) => this.changeSize(ev)}
              value="50x30"
            >50x30</button>
            <button
              id="size-70x50-btn"
              className="btn"
              onClick={(ev) => this.changeSize(ev)}
              value="70x50"
            >70x50</button>
            <button
              id="size-100x80-btn"
              className="btn"
              onClick={(ev) => this.changeSize(ev)}
              value="100x80"
            >100x80</button>
          </div>
          <div className="control-speed">
            <span className="control-label">Sim Speed: </span>
            <button id="speed-slow-btn" className="btn">Slow</button>
            <button id="speed-medium-btn" className="btn">Medium</button>
            <button id="speed-fast-btn" className="btn">Fast</button>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Board;
