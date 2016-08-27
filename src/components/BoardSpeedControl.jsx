import React from 'react';

function BoardSpeedControl(props) {
  return (
    <div className="control-speed">
      <span className="control-label">Sim Speed: </span>
      <button
        id="speed-slow-btn"
        className="btn"
        onClick={props.onClick}
        value="1000"
      >Slow</button>
      <button
        id="speed-medium-btn"
        className="btn"
        onClick={props.onClick}
        value="500"
      >Medium</button>
      <button
        id="speed-fast-btn"
        className="btn"
        onClick={props.onClick}
        value="100"
      >Fast</button>
    </div>
  );
}

export default BoardSpeedControl;
