import React from 'react';

function BoardSpeedControl(props) {
  const speeds = ['slow', 'medium', 'fast'];
  const buttons = speeds.map((speed, idx) => (
    <button
      id={`speed-${speed}-btn`}
      className={idx === props.activeButton ? 'btn btn-active' : 'btn'}
      onClick={props.onClick}
      value={props.delays[idx]}
      key={idx}
    >{speed}</button>
  ));
  return (
    <div className="control-speed">
      <span className="control-label">Sim Speed: </span>
      { buttons }
    </div>
  );
}

export default BoardSpeedControl;
