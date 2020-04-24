import React from 'react';
import PropTypes from 'prop-types';

const GolemOptions = ({
  isPaused,
  onStartPauseClick,
}) => (
  <div className="golem-options">
    <div className="golem-options-buttons">
      <input type="button" className="golem-input-button" id="golem-options-start" value={isPaused ? 'Start' : 'Pause'} onClick={onStartPauseClick} />
      <input type="button" className="golem-input-button" id="golem-options-step" value="Step" />
      <input type="button" className="golem-input-button" value="Clear" />
      <input type="button" className="golem-input-button" value="Randomize" />
    </div>

    <label className="golem-options-label" htmlFor="golem-options-rules">
      <span className="golem-options-label-text">Rules (S/B/C)</span>
      <input type="text" className="golem-input-text" id="golem-options-rules" />
    </label>

    <label className="golem-options-label" htmlFor="golem-options-presets">
      <span className="golem-options-label-text">Preset Rules</span>
      <select className="golem-input-select" id="golem-options-presets" defaultValue="23/3/2">
        <option value="none" disabled>(None)</option>
        <option value="125/36/2">2x2</option>
        <option value="23/34/2">34 Life</option>
        <option value="35678/4678/2">Anneal</option>
        <option value="2367/3457/5">Banners</option>
        <option value="23/23/8">BelZhab</option>
        <option value="145678/23/8">BelZhab Sediment</option>
        <option value="234/34678/24">Bloomerang</option>
        <option value="345/24/25">Bombers</option>
        <option value="6/246/3">Brain 6</option>
        <option value="/2/3">Brian&apos;s Brain</option>
        <option value="0235678/3468/9">Burst</option>
        <option value="235678/3468/9">Burst II</option>
        <option value="124567/378/4">Caterpillars</option>
        <option value="2345/1234/8">Circuit Genius</option>
        <option value="23/2/8">Cooties</option>
        <option value="5678/35678/2">Diamoeba</option>
        <option value="23/37/2">DryLife</option>
        <option value="012478/36/18">Ebb &amp; Flow</option>
        <option value="012468/37/18">Ebb &amp; Flow II</option>
        <option value="2/2/25">Faders</option>
        <option value="2/13/21">Fireworks</option>
        <option value="347/23/8">Flaming Starbows</option>
        <option value="12/34/3">Frogs</option>
        <option value="356/23/6">Frozen Spirals</option>
        <option value="035678/245678/7">Glisserati</option>
        <option value="035678/245678/5">Glissergy</option>
        <option value="23/36/2">HighLife</option>
        <option value="12345/45678/8">Lava</option>
        <option value="23/3/2">Life</option>
        <option value="012345/458/3">Lines</option>
        <option value="345/3/6">LivingOnTheEdge</option>
        <option value="1234/3/2">Mazectric</option>
        <option value="01245678/3/8">Meteor Guns</option>
        <option value="245/3678/2">Morley</option>
        <option value="45678/2478/25">Nova</option>
        <option value="3/2/4">OrthoGo</option>
        <option value="23/38/2">Pedestrian Life</option>
        <option value="345/34/6">Prairie on Fire</option>
        <option value="2/23/8">RainZha</option>
        <option value="2467/2678/6">Rake</option>
        <option value="/2/2">Seeds</option>
        <option value="45678/25678/4">SediMental</option>
        <option value="03467/25/6">Snake</option>
        <option value="13458/38/6">SoftFreeze</option>
        <option value="2/234/5">Spirals</option>
        <option value="345/2/4">Star Wars</option>
        <option value="3456/2/6">Sticks</option>
        <option value="23/34/8">Swirl</option>
        <option value="1234/34/48">ThrillGrill</option>
        <option value="345/26/5">Transers</option>
        <option value="0345/26/6">Transers II</option>
        <option value="345/34678/5">Wanderers</option>
        <option value="3467/25/6">Worms</option>
        <option value="1456/2356/16">Xtasy</option>
        <option value="" disabled>&nbsp;</option>
        <option value="4567/2567/4">(Ted&apos;s) Beehive</option>
        <option value="35/2/3">(Ted&apos;s) Headache</option>
        <option value="2356/378/4">(Ted&apos;s) Mitosis</option>
        <option value="2578/2578/6">(Ted&apos;s) Runners</option>
        <option value="0123/3/2">(Ted&apos;s) SlowMaze</option>
        <option value="34678/3678/3">(Ted&apos;s) Starry Night</option>
        <option value="345/357/4">(Ted&apos;s) Sunbursts</option>
        <option value="3467/2468/13">(Ted&apos;s) Zoomies</option>
      </select>
    </label>
  </div>
);

export default GolemOptions;

GolemOptions.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  onStartPauseClick: PropTypes.func.isRequired,
};
