import React from 'react';
import Bubble from './Bubble';

export default class Dialoge extends React.Component {
  state = { isLoading: true, showContent: false };

  componentDidMount() {
    this.timer1 = setTimeout(() => this.setState({ isLoading: false }), 4000);
    this.timer2 = setTimeout(() => this.setState({ showContent: true }), 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
  }

  render() {
    return (
      <li>
        <Bubble isLoading={this.state.isLoading}>{this.props.text}</Bubble>
        {
          this.state.showContent? this.props.children : ''
        }
      </li>
    );
  }
}
