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
      speed: 2
    };
  }
  render() {
    return (
      <div className='board'>
        <div className='control-top'>
          <button id='run-btn' className='btn'>Run</button>
          <button id='pause-btn' className='btn'>Pause</button>
          <button id='clear-btn' className='btn'>Clear</button>
          <span className='counter-label'>Generation: </span><span className='counter'>999999</span>
        </div>
        <div className={'cell-container cell-container-' + this.state.numCol + 'x' + this.state.numRow}>
          {this._generateCells() }
        </div>
        <div className='control-bottom'>
          <div className='control-size'>
            <span className='control-label'>Board Size: </span>
            <button id='size-50x30-btn' className='btn' onClick={() => this._changeSize(50,30)}>50x30</button>
            <button id='size-70x50-btn' className='btn' onClick={() => this._changeSize(70,50)}>70x50</button>
            <button id='size-100x80-btn' className='btn' onClick={() => this._changeSize(100,80)}>100x80</button>
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
  _generateCells() {
    var cells = [];
    for (let i = 0; i < (this.state.numCol * this.state.numRow); i++) {
      cells.push(<Cell key={i} />);
    }
    return cells;
  }
  _changeSize(numCol, numRow) {
    this.setState({
      numCol: numCol,
      numRow: numRow
    });
  }
}

class Cell extends React.Component {
  render() {
    return (
      <div className='cell'>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);