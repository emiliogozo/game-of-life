import React from 'react';

function BoardSizeControl(props) {
  const buttons = props.sizes.map((dim, idx) => (
    <button
      id={`size-${dim}-btn`}
      className={idx === props.activeButton ? 'btn btn-active' : 'btn'}
      onClick={props.onClick}
      value={dim}
      key={idx}
    >{dim}</button>
  ));
  return (
    <div className="control-size">
      <span className="control-label">Board Size: </span>
      {buttons}
    </div>
  );
}

export default BoardSizeControl;
