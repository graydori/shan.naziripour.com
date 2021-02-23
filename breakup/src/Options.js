import React from 'react';

export default class Options extends React.Component {
    render() {
        return (<ul className={`reorder-${Math.floor(Math.random() * 6)}`}>
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