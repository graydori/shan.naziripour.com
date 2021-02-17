import React from 'react';

export default class Bubble extends React.Component {
    render() {
        return (<span className="bubble bubble--you">
          {this.props.isLoading ?
            (<div className="dot-flashing-wrapper">
                <div className="dot-flashing"></div>
            </div>): this.props.children }
        </span>);
    }
}