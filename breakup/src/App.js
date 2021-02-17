import React from 'react';
import './App.css';
import './Dialoge';
import Dialoge, { Options } from './Dialoge';
import ReactGA from 'react-ga';

const trackingId = "UA-34564934-1"; // Replace with your Google Analytics tracking ID

ReactGA.initialize(trackingId);

class ResizableTextarea extends React.PureComponent {
  state = {
    value: '',
    rows: 1,
    minRows: 1,
    maxRows: 10,
  };

  handleChange = (event) => {
    const textareaLineHeight = 24;
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
  };

  render() {
    return (
      <textarea
        autoFocus={true}
        width="100%"
        rows={this.state.rows}
        value={this.state.value}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
      />
    );
  }
}

export default class App extends React.Component {
  state = {
    current: 0,
    pos: 0,
    neg: 0,
    reality: 0,
    list: [
      {
        text: 'I thought we were in love',
        options:
        {
          reality: 'Who are you?',
          neg: 'It was a figment of your imagination',
          pos: 'Why?'
        },
      },
      {
        text: 'Why would you say that? It hurts so much.',
        options: {
          neg: 'Move on - I don’t love you',
          reality: 'Who are you?!',
          pos: 'I’m trying to understand you.'
        }
      },
      {
        text: 'We would hold each other forever, it was beautiful. Don’t you remember?',
        options: {
          reality: 'Remember what?',
          pos: 'It was but that’s in the past.',
          neg: 'You’re so clingy.'
        }
      },
      {
        text: 'I don’t know why you keep pushing me away.',
        options: {
          pos: 'Things can’t always stay the same',
          neg: 'Yah because you’re crazy.',
          reality: 'I don’t know you.'
        }
      },
      {
        text: 'Did you not like any of it?',
        options: {
          reality: 'I don’t know what you’re talking about',
          pos: 'It was beautiful',
          neg: 'You’re so manipulative',
        }
      },
      {
        text: 'I can change, what do you want?',
        options: {
          pos: 'Don’t change for me, change for yourself.',
          neg: 'I tried and your wouldn’t listen what makes you think now is any different?',
          reality: 'Go away'
        }
      },
      {
        text: 'I’ll do anything, it hurts so much',
        options: {
          reality: 'Please stop',
          pos: 'Time heals all wounds',
          neg: 'Not my problem',
        },
      },
      {
        text: 'I just want to feel that closeness again',
        options: {
          reality: 'We never did',
          neg: 'You never gave me what I wanted',
          pos: 'I’ll cherish it forever'
        }
      },
      {
        text: 'I can’t deal with the loss of you',
        options: {
          reality: 'You didn’t lose anyone',
          pos: 'I’m always here for you',
          neg: 'You caused this',
        }
      },
      {
        text: 'Just tell me the truth',
        options: {
          pos: 'We don’t know each other',
          neg: 'You can’t handle the truth',
          reality: 'What truth',
        }
      },
      {
        text: 'I loved you so much. You were my world',
        options: {
          reality: 'We were never in love',
          pos: 'I loved you too',
          neg: 'You were never enough',
        }
      },
      {
        text: 'I don’t understand',
        options: {
          reality: 'We don’t know each other',
          pos: 'It was a moment of love but we must moved on. It’s best for both of us',
          neg: 'You were always trying to trap me',
        }
      },
      {
        text: 'But it doesn’t make sense',
        options: {
          reality: 'You’re talking to the wrong person',
          neg: 'You never let me be and just wanted control me',
          pos: 'Sometime a relationship is not working and that’s okay, sometimes we need to move on. I’ll always love you.',
        }
      }
    ],
  };

  final = {
    pos: "I love you too.",
    neg: "I feel so empty.",
    reality: "Sorry wrong number"
  };

  onPos() {
    const item = this.state.list[this.state.current];
    const list = [...this.state.list];
    list[this.state.current] = Object.assign({}, item, { selected: 'pos' });

    ReactGA.event({
      category: "breakup",
      action: "pos",
      label: item.options.pos
    });

    this.setState({
      current: this.state.current + 1,
      pos: this.state.pos + 1,
      list
    });

    this.logLast();
  }

  onNeg() {
    const item = this.state.list[this.state.current];
    const list = [...this.state.list];
    list[this.state.current] = Object.assign({}, item, { selected: 'neg' });

    ReactGA.event({
      category: "breakup",
      action: "neg",
      label: item.options.neg
    });

    this.setState({
      current: this.state.current + 1,
      neg: this.state.neg + 1,
      list
    });

    this.logLast();
  }

  onReality() {
    const item = this.state.list[this.state.current];
    const list = [...this.state.list];
    list[this.state.current] = Object.assign({}, item, { selected: 'reality' });

    ReactGA.event({
      category: "breakup",
      action: "reality",
      label: item.options.reality
    });

    this.setState({
      current: this.state.current + 1,
      reality: this.state.reality + 1,
      list,
    });

    this.logLast();
  }

  logLast() {
    if (this.isMax()) {
      ReactGA.event({
        category: "breakup",
        action: "final",
        label: this.calcMax()
      });
    }
  }

  isMax() {
    return this.state.current === this.state.list.length;
  }

  calcMax() {
    return (this.state.pos > Math.max(this.state.neg, this.state.reality)) ?
      "pos" :
      (this.state.neg > Math.max(this.state.pos, this.state.reality)) ?
        "neg" : "reality";
  }

  onSubmit(event) {
    this.setState({ feedback: event.target[0].value });
    ReactGA.event({
      category: "breakup",
      action: "feedback",
      label: event.target[0].value,
    });
    event.preventDefault();
    return false;
  }

  render() {
    return (
      <div className={"app " + (this.state.final?'app--final':'') }>
        {this.state.final?
          (<h1>
            <span className="bubble bubble--me"><b>Break</b><b>Up</b></span>
            <small>an interactive story</small>
          </h1>):
          (<footer>
            <div>
              <span className="bubble bubble--you">Thank you for your feelings</span>
              <span className="bubble bubble--you">Every text creates a new reality</span>
              <button className="bubble bubble--me">Share my experience</button>
            </div>
          </footer>)
        }
        <div className="phone">
          <ul className="phone-content">
            {
              this.state.list.map((item, i) => {
                if (this.state.current >= i) {
                  return (<Dialoge
                    key={i}
                    text={item.text} >
                    {
                      item.selected ?
                        (<span className="bubble bubble--me">
                          {item.options[item.selected]}
                        </span>) :
                        (<Options
                          onPos={this.onPos.bind(this)}
                          onNeg={this.onNeg.bind(this)}
                          onReality={this.onReality.bind(this)}
                          pos={item.options.pos}
                          neg={item.options.neg}
                          reality={item.options.reality} />)
                    }
                  </Dialoge>)
                }
                return undefined;
              })
            }
            {
              (this.isMax()) ?
                (
                  <Dialoge text={this.final[this.calcMax()]} >
                    {
                      this.state.feedback?
                        (<span class="bubble bubble--me">{this.state.feedback}</span>):
                        (<form action="next" onSubmit={this.onSubmit.bind(this)}>
                          <ResizableTextarea placeholder="How do you feel?"></ResizableTextarea>
                          <button><img alt="Send" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADFwAAAxcBwpsE1QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGmSURBVGiB7Zc/TsMwFIefgfJnYq8oFaVFggNwDhBcACYQDJSzwHkQGzdAQKkoVOrE0ooFJD6GOiIqbpOmOM7wPimL/eL3+5JYikUURVGUGMASsBQ6x0wAG8CLvTZC58kEUAHa/NIG1kLnmgor0eIvT0AldL5UAOvAs0MiogWsh845EaAOvE2QiHgF6qHzOgG2gV4KiYi3wskAO1NKRPSAndD5RUQEqAGdDBIRHaAWWqLO8HuflVdgM5REg3QbOy357xlgC+hOCPVtr7TjEV2gkZfECvCQIHECfDrmPoHTBJl7YDkPkcMEiTNb5xSxc+cJMgfT5prL4LI6zlFELowx10kLGGOuRKSZocf/AVSBD8dTbI7UjX0jsZpLR80AqHoXsQH2gXfbuA8cOWoSRWzdsV0Du+ZeLhKxAAsMfxBLY+ZTidjakl1rIWsek/XGJGzoUckvY8yij35ZNnshUZGioSJFQ0WKhooUDRUpGipSNFQkBQPHWN9XM58it46xG4/9/ACUgcfY6bAFlH3183ZCFBkeh0VkV0TmReTOGPPls5+iKIqSOz+//PHBQmd6nQAAAABJRU5ErkJggg==" /></button>
                        </form>)
                    }
                  </Dialoge>
                ) : ''
            }
          </ul>
        </div>
      </div>
    );
  }
}
