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
      numCol: 70,
      numRow: 50,
      delay: 100,
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
  }
  getNeighbors(id) {
    const { i, j } = this.getCellIndex(id);
    const cols = this.state.numCol;
    const rows = this.state.numRow;
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
    this.setState({ numCol, numRow, stopSim: true });
  }
  changeDelay(ev) {
    const delay = parseInt(ev.target.value, 10);
    this.setState({ delay });
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
          <BoardAnimationControl
            delay={this.state.delay}
            stopSim={this.state.stopSim}
            onStart={() => this.updateCellStatus()}
            onStop={() => this.initCellStatus()}
          />
        </div>
        <div className={`cell-container cell-container-${this.state.numCol}x${this.state.numRow}`}>
          { cells }
        </div>
        <div className="control-bottom">
          <BoardSizeControl onClick={ev => this.changeSize(ev)} />
          <BoardSpeedControl onClick={ev => this.changeDelay(ev)} />
        </div>
      </div>
    );
  }
}

export default Board;
