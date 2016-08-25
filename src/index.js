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
      speed: 1000,
      generation: 0
    };
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
          {this._generateCells() }
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
  _generateCells() {
    var cells = [];
    for (let i = 0; i < this.state.numCol; i++) {
      for (let j = 0; j < this.state.numRow; j++) {
        let cellName = i < 10 ? '0' + i : '' + i;
        cellName += j < 10 ? '0' + j : '' + j;
        cells.push(<Cell name={cellName} key={cellName} />);
      }
    }
    return cells;
  }
  /**
   * Start the animation by running a setInterval instance
   */ 
  _startAnimation() {
    this.interval = setInterval(() => {
        this.setState({
          generation: this.state.generation + 1
        });
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
    this.setState({
      generation: 0
    });
  }
  _changeSize(ev) {
    const [numCol, numRow] = ev.target.value.split('x').map(val => parseInt(val));
    this.setState({
      numCol: numCol,
      numRow: numRow
    });
  }
}

class Cell extends React.Component {
  constructor() {
    super();
    this.state = {
      alive: false,
      newBorn: true,
      className: 'cell'
    };
  }
  render() {
    return (
      <div id={this.props.name} className={this.state.className} onClick={(ev) => this._onClick(ev) }>
      </div>
    );
  }
  _onClick(ev) {
    var className = ev.target.className;
    if (/\ new\-born/.test(className)) {
      className = className.replace(/\ new\-born/, '');
    } else {
      className += ' new-born';
    }
    this.setState({
      alive: !this.state.alive,
      newBorn: true,
      className: className
    });
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Main />, app);