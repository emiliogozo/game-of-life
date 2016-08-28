import React from 'react';

class BoardAnimationControl extends React.Component {
  constructor() {
    super();
    this.state = {
      generation: 0
    };
  }
  componentDidMount() {
    this.startAnimation();
  }
  /**
   * Start the animation by running a setInterval instance
   */
  startAnimation() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.props.stopSim) {
        this.clearBoard();
      } else {
        this.props.onStart();
        this.setState({
          generation: this.state.generation + 1
        });
      }
    }, this.props.delay);
  }
  /**
   * Clears the board and resets the counter to zero
   */
  clearBoard() {
    this.pauseAnimation();
    this.props.onStop();
    this.setState({
      generation: 0
    });
  }
  /**
   * Halts the animation by stopping the counter
   */
  pauseAnimation() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <div className="control-animation">
        <button id="run-btn" className="btn" onClick={() => this.startAnimation()}>
        Run</button>
        <button id="pause-btn" className="btn" onClick={() => this.pauseAnimation()}>
        Pause</button>
        <button id="clear-btn" className="btn" onClick={() => this.clearBoard()}>
        Clear</button>
        <span className="counter-label">Generation: </span>
        <span className="counter">{this.state.generation}</span>
      </div>
    );
  }
}

export default BoardAnimationControl;
