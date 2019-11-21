import React from 'react';

export default class GolemOptions extends React.Component {
  componentDidMount() {
    this.props.onGolemOptionsDidMount();
  }

  componentDidUpdate() {
    this.props.setStartPause();
  }

  render() {
    return (
      <div className="golem-options">
        <div className="golem-options-buttons">
          <input type="button" className="golem-input-button" id="golem-options-start" value="Start" onClick={this.props.onStartPauseClick}/>
          <input type="button" className="golem-input-button" id="golem-options-step" value="Step" onClick={() => this.props.onButtonClick('step')}/>
          <input type="button" className="golem-input-button" value="Clear" onClick={() => this.props.onButtonClick('clear')}/>
          <input type="button" className="golem-input-button" value="Randomize" onClick={() => this.props.onButtonClick('randomize')}/>
        </div>

        <div className="golem-options-text">
          <label className="golem-input-label" htmlFor="compact-rules">Rules (B/S/C)</label>
          <input type="text" className="golem-input-text" id="golem-options-rules" name="compact-rules" onInput={this.props.onRulesInput}/>
        </div>

        <div className="golem-options-text">
          <label className="golem-input-label">Preset Rules</label>
          <select className="golem-input-select" id="golem-options-presets" defaultValue="3/23/2" onChange={this.props.onSelectRulesChange}>
          <option value="" disabled>(None)</option>
          <option value="3457/2367/5">Banners</option>
          <option value="23/23/8">BelZhab</option>
          <option value="23/145678/8">BelZhab Sediment</option>
          <option value="34678/234/24">Bloomerang</option>
          <option value="24/345/25">Bombers</option>
          <option value="246/6/3">Brain 6</option>
          <option value="2/-1/3">Brian's Brain</option>
          <option value="3468/0235678/9">Burst</option>
          <option value="3468/235678/9">Burst II</option>
          <option value="378/124567/4">Caterpillars</option>
          <option value="1234/2345/8">Circuit Genius</option>
          <option value="2/23/8">Cooties</option>
          <option value="36/012478/18">Ebb & Flow</option>
          <option value="37/012468/18">Ebb & Flow II</option>
          <option value="2/2/25">Faders</option>
          <option value="13/2/21">Fireworks</option>
          <option value="23/347/8">Flaming Starbows</option>
          <option value="34/12/3">Frogs</option>
          <option value="23/356/6">Frozen Spirals</option>
          <option value="245678/035678/7">Glisserati</option>
          <option value="245678/035678/5">Glissergy</option>
          <option value="36/23/2">HighLife</option>
          <option value="45678/12345/8">Lava</option>
          <option value="3/23/2">Life</option>
          <option value="458/012345/3">Lines</option>
          <option value="3/345/6">LivingOnTheEdge</option>
          <option value="3/01245678/8">Meteor Guns</option>
          <option value="2478/45678/25">Nova</option>
          <option value="2/3/4">OrthoGo</option>
          <option value="34/345/6">Prairie on Fire</option>
          <option value="23/2/8">RainZha</option>
          <option value="2678/2467/6">Rake</option>
          <option value="2/-1/2">Seeds</option>
          <option value="25678/45678/4">SediMental</option>
          <option value="25/03467/6">Snake</option>
          <option value="38/13458/6">SoftFreeze</option>
          <option value="234/2/5">Spirals</option>
          <option value="2/345/4">Star Wars</option>
          <option value="2/3456/6">Sticks</option>
          <option value="34/23/8">Swirl</option>
          <option value="34/1234/48">ThrillGrill</option>
          <option value="26/345/5">Transers</option>
          <option value="26/0345/6">Transers II</option>
          <option value="34678/345/5">Wanderers</option>
          <option value="25/3467/6">Worms</option>
          <option value="2356/1456/16">Xtasy</option>
          <option value="" disabled></option>
          <option value="2567/4567/4">(Ted's) Beehive</option>
          <option value="456/4567/6">(Ted's) Dotcillation</option>
          <option value="256/456/3">(Ted's) RainBrain</option>
          <option value="246/346/6">(Ted's) Runners</option>
          <option value="3678/34678/3">(Ted's) Starry Night</option>
          <option value="357/345/4">(Ted's) Sunbursts</option>
        </select>
        </div>
      </div>
    );
  }
}
