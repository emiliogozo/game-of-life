import React from 'react';

import Cell from './Cell';
import BoardAnimationControl from './BoardAnimationControl';
import BoardSizeControl from './BoardSizeControl';
import BoardSpeedControl from './BoardSpeedControl';

import ArrayHelper from '../utils/ArrayHelper';

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      sizes: ['50x30', '70x50', '100x80'],
      activeSizeButton: 1,
      delays: [1000, 500, 50],
      activeDelayButton: 2,
      aliveArr: [],
      stopSim: false
    };
  }
  onCellClick(ev) {
    if (!this.isAlive(ev.target.id)) {
      this.state.aliveArr.push(ev.target.id);
    } else {
      this.state.aliveArr = this.state.aliveArr.filter(id => id !== ev.target.id);
    }
    if (this.state.stopSim) {
      this.setState({
        stopSim: false
      });
    }
  }
  getNeighbors(id) {
    const { i, j } = this.getCellIndex(id);
    const [cols, rows] = this.getDimension();
    const nbArr = [
      { i: i + 1, j: j - 1 }, { i: i + 1, j }, { i: i + 1, j: j + 1 }, { i, j: j + 1 },
      { i: i - 1, j: j + 1 }, { i: i - 1, j }, { i: i - 1, j: j - 1 }, { i, j: j - 1 }
    ];
    return nbArr.map(nb => {
      let ii = nb.i;
      let jj = nb.j;
      if (ii < 0) ii += cols;
      if (ii >= cols) ii -= cols;
      if (jj < 0) jj += rows;
      if (jj >= rows) jj -= rows;
      return this.cellIndexToId({ i: ii, j: jj });
    });
  }
  getCellIndex(id) {
    const [cols] = this.getDimension();
    const n = parseInt(id, 10);
    const i = n % cols;
    const j = Math.floor(n / cols);
    return ({ i, j });
  }
  getDimension() {
    return this.state.sizes[this.state.activeSizeButton]
      .split('x').map(str => parseInt(str, 10));
  }
  isAlive(id) {
    return this.state.aliveArr.indexOf(id) !== -1;
  }
  changeSize(ev) {
    this.setState({
      stopSim: true,
      activeSizeButton: this.state.sizes.indexOf(ev.target.value)
    });
  }
  changeDelay(ev) {
    const delay = parseInt(ev.target.value, 10);
    this.setState({
      activeDelayButton: this.state.delays.indexOf(delay)
    });
  }
  updateCellStatus() {
    const aliveArr = this.state.aliveArr;
    let newAliveArr = [];
    newAliveArr = aliveArr.map(alive =>
      [alive].concat(this.getNeighbors(alive))
    );
    newAliveArr = ArrayHelper.flatten(newAliveArr);
    newAliveArr = ArrayHelper.unique(newAliveArr);
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
    newAliveArr = ArrayHelper.flatten(newAliveArr);

    this.setState({
      aliveArr: newAliveArr
    });
  }
  initCellStatus() {
    this.setState({
      aliveArr: [],
      stopSim: false
    });
  }
  cellIndexToId(cell) {
    const [cols] = this.getDimension();
    return ((cell.j * cols) + cell.i).toString();
  }
  render() {
    const [cols, rows] = this.getDimension();
    let cells = [...new Array(cols * rows)]
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
          <BoardAnimationControl
            delay={this.state.delays[this.state.activeDelayButton]}
            stopSim={this.state.stopSim}
            onStart={() => this.updateCellStatus()}
            onStop={() => this.initCellStatus()}
          />
        </div>
        <div className={`cell-container cell-container-${cols}x${rows}`}>
          { cells }
        </div>
        <div className="control-bottom">
          <BoardSizeControl
            sizes={this.state.sizes}
            activeButton={this.state.activeSizeButton}
            onClick={ev => this.changeSize(ev)}
          />
          <BoardSpeedControl
            delays={this.state.delays}
            activeButton={this.state.activeDelayButton}
            onClick={ev => this.changeDelay(ev)}
          />
        </div>
      </div>
    );
  }
}

export default Board;
