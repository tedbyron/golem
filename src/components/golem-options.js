import React from 'react';

export default class GolemOptions extends React.Component {
  componentDidMount() {
    document.getElementsByClassName('golem-input-text')[0].placeholder = this.props.compactRules;
  }

  render() {
    return (
      <div className="golem-options">
        <div className="golem-options-row">
          <input type="button" className="golem-input-button" value="Start/Stop" onClick={() => this.props.onButtonClick('startstop')}/>
          <input type="button" className="golem-input-button" value="Step" onClick={() => this.props.onButtonClick('step')}/>
          <input type="button" className="golem-input-button" value="Clear" onClick={() => this.props.onButtonClick('clear')}/>
          <input type="button" className="golem-input-button" value="Randomize" onClick={() => this.props.onButtonClick('randomize')}/>
        </div>
        <div className="golem-options-row">
          <label className="golem-input-label" htmlFor="compact-rules">Rules &lt;B/S/C&gt;</label>
          <select className="golem-input-select" defaultValue="3/23/2" onChange={() => this.props.onSelectRulesChange()}>
            <option value="" disabled>Custom</option>
            <option value="" disabled></option>
            <option value="2567/4567/4">Bees</option>
            <option value="24/345/25">Bombers</option>
            <option value="246/6/3">Brain 6</option>
            <option value="2/-1/3">Brian's Brain</option>
            <option value="36/23/2">HighLife</option>
            <option value="3/23/2">Life</option>
            <option value="458/012345/3">Lines</option>
            <option value="2678/2467/6">Rake</option>
            <option value="2/-1/2">Seeds</option>
            <option value="25678/45678/4">SediMental</option>
            <option value="2/345/4">Star Wars</option>
            <option value="3678/34678/3">Starry Night</option>
          </select>
          <input type="text" className="golem-input-text" name="compact-rules" size="18"/>
        </div>
      </div>
    );
  }
}
