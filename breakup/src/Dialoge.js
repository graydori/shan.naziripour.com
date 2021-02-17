import React from 'react';
import Bubble from './Bubble';

class LoadingTimer extends React.Component {
  state = { isLoading: true };

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ isLoading: false }), 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}

export class Options extends React.Component {
  onSelect(selection) {
    this.setState({ selection });
    switch (selection) {
      case 'reality':
        this.props.onNeg();
        break;
      case 'pos':
        this.props.onPos();
        break;
      case 'neg':
        this.props.onNeg();
        break;
      default:
    }
  }
  render() {
    return (<ul>
    <li>
      <button className="bubble bubble--me" onClick={this.props.onReality} >
        {this.props.reality}
      </button>
    </li>
    <li>
      <button className="bubble bubble--me" onClick={this.props.onNeg} >
        {this.props.neg}
      </button>
    </li>
    <li>
      <button className="bubble bubble--me" onClick={this.props.onPos} >
        {this.props.pos}
      </button>
    </li>
    </ul>);
  }

}

export default class Dialoge extends LoadingTimer {
  render() {
    return (
      <li>
        <Bubble isLoading={this.state.isLoading}>{this.props.text}</Bubble>
        <div className={this.state.isLoading? 'hidden': 'show'}>
          {this.props.children}
        </div>
      </li>
    );
  }
}
