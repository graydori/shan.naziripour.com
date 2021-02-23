import React from 'react';
import './App.css';
import './Dialoge';
import Dialoge from './Dialoge';
import Options from './Options';
import ShareBtn from './ShareBtn/ShareBtn';
import ReactGA from 'react-ga';
import TextareaAutosize from 'react-textarea-autosize';
import { List, FinalText } from './Constants';


const trackingId = "UA-34564934-1";

ReactGA.initialize(trackingId);
export default class App extends React.Component {
  state = {
    current: 0,
    pos: 0,
    neg: 0,
    reality: 0,
    list: List,
  };

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ isLoaded: true }), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  final = FinalText

  onPos() {
    const item = this.state.list[this.state.current];
    const list = [...this.state.list];
    list[this.state.current] = Object.assign({}, item, { selected: 'pos' });

    ReactGA.event({
      category: `breakup:${("00" + this.state.current).slice(-2)}`,
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
      category: `breakup:${("00" + this.state.current).slice(-2)}`,
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
      category: `breakup:${("00" + this.state.current).slice(-2)}`,
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
    return this.state.current === List.length;
  }

  calcMax() {
    return (this.state.pos > Math.max(this.state.neg, this.state.reality)) ?
      "pos" :
      (this.state.neg > Math.max(this.state.pos, this.state.reality)) ?
        "neg" : "reality";
  }

  onSubmit(e) {
    e.preventDefault();
    this.submitFeedback(e.target[0].value);
    return false;
  }

  onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.submitFeedback(e.target.value);
    }
  }

  submitFeedback(feedback) {
    this.setState({ feedback });
    ReactGA.event({
      category: "breakup",
      action: "feedback",
      label: feedback,
    });
  }

  sharedBy(label) {
    ReactGA.event({
      category: "breakup",
      action: "share",
      label,
    });
  }

  retry() {
    ReactGA.event({
      category: "breakup",
      action: "retry",
    });
    window.location.reload();
  }

  render() {
    return (
      <div className={`app ${this.state.isLoaded ? 'app--loaded':''} ${this.state.feedback ? 'app--final' : ''}`}>
        {
          this.state.feedback ?
            <footer>
              <div className="footer-inner">
                <span className="bubble bubble--you">Thank you opening up with your feelings</span>
                <span className="bubble bubble--you">Every choice creates a new reality</span>
                <button onClick={this.retry} className="bubble bubble--me">Try again</button>
                <ShareBtn
                  sharedBy={this.sharedBy}
                  url="https://shan.naziripour.com/breakup"
                  className="bubble bubble--me"
                  text="Let's BreakUp "
                  displayText="Share my experience" />
              </div>
            </footer> : ''
        }
        <div className="app-inner">
          <h1>
            <span className="bubble bubble--me">
              <i>❤️</i>
              <i>💔</i>
              <b>Break</b><b>Up</b>
            </span>
            <small>an interactive story</small>
          </h1>
          <div className="phone">
            <ul className="phone-content">
            {
                (this.isMax()) ?
                  (
                    <Dialoge key="feedback" text={this.final[this.calcMax()]} >
                      {
                        this.state.feedback ?
                          (<span className="bubble bubble--me">{this.state.feedback}</span>) :
                          (<form
                            ref={el => this.form = el}
                            action="next"
                            onSubmit={this.onSubmit.bind(this)}>
                            <TextareaAutosize
                              onKeyDown={this.onEnterPress.bind(this)}
                              placeholder="How do you feel?"
                              width="100%"
                              autoFocus={true} ></TextareaAutosize>
                            <button><img alt="Send" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADFwAAAxcBwpsE1QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGmSURBVGiB7Zc/TsMwFIefgfJnYq8oFaVFggNwDhBcACYQDJSzwHkQGzdAQKkoVOrE0ooFJD6GOiIqbpOmOM7wPimL/eL3+5JYikUURVGUGMASsBQ6x0wAG8CLvTZC58kEUAHa/NIG1kLnmgor0eIvT0AldL5UAOvAs0MiogWsh845EaAOvE2QiHgF6qHzOgG2gV4KiYi3wskAO1NKRPSAndD5RUQEqAGdDBIRHaAWWqLO8HuflVdgM5REg3QbOy357xlgC+hOCPVtr7TjEV2gkZfECvCQIHECfDrmPoHTBJl7YDkPkcMEiTNb5xSxc+cJMgfT5prL4LI6zlFELowx10kLGGOuRKSZocf/AVSBD8dTbI7UjX0jsZpLR80AqHoXsQH2gXfbuA8cOWoSRWzdsV0Du+ZeLhKxAAsMfxBLY+ZTidjakl1rIWsek/XGJGzoUckvY8yij35ZNnshUZGioSJFQ0WKhooUDRUpGipSNFQkBQPHWN9XM58it46xG4/9/ACUgcfY6bAFlH3183ZCFBkeh0VkV0TmReTOGPPls5+iKIqSOz+//PHBQmd6nQAAAABJRU5ErkJggg==" /></button>
                          </form>)
                      }
                    </Dialoge>
                  ) : ''
              }
              {
                this.state.list
                  .filter((_item, i) => this.state.current >= i)
                  .reverse()
                  .map((item) => {
                    return (<Dialoge
                      key={item.id}
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
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
