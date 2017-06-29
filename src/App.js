import React, { Component } from 'react';
import logo from './logo.svg';
import RogueLike from './RogueLike';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>RogueLike Dungeon Crawler</h2>
        </div>
        <RogueLike />
      </div>
    );
  }
}

export default App;
