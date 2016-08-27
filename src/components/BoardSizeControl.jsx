import React from 'react';

function BoardSizeControl(props) {
  return (
    <div className="control-size">
      <span className="control-label">Board Size: </span>
      <button
        id="size-50x30-btn"
        className="btn"
        onClick={props.onClick}
        value="50x30"
      >50x30</button>
      <button
        id="size-70x50-btn"
        className="btn"
        onClick={props.onClick}
        value="70x50"
      >70x50</button>
      <button
        id="size-100x80-btn"
        className="btn"
        onClick={props.onClick}
        value="100x80"
      >100x80</button>
    </div>
  );
}

export default BoardSizeControl;
