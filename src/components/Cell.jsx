import React from 'react';

class Cell extends React.Component {
  constructor() {
    super();
    this.state = {
      className: 'cell'
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isAlive) {
      if (!this.isAlive(this.state.className)) {
        this.setState({
          className: 'cell new-born'
        });
      } else if (this.isNewBorn(this.state.className)) {
        this.setState({
          className: 'cell alive'
        });
      }
    } else {
      this.setState({
        className: 'cell'
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.className !== nextState.className;
  }
  onClick(ev) {
    let className = ev.target.className;
    const isAlive = this.isAlive(className);
    if (!isAlive) {
      className += ' new-born';
    } else {
      className = 'cell';
    }
    this.setState({ className });
    this.props.onClick(ev);
  }
  isAlive(className) {
    return /alive/.test(className) || /new\-born/.test(className);
  }
  isNewBorn(className) {
    return /new\-born/.test(className);
  }
  render() {
    return (
      <div
        id={this.props.id}
        className={this.state.className}
        onClick={(ev) => this.onClick(ev)}
      />
    );
  }
}

export default Cell;
