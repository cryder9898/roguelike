import React, { Component } from 'react';
import RogueLike from './RogueLike';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>RogueLike Dungeon Crawler</h2>
        </div>
        <RogueLike />
      </div>
    );
  }
}

export default App;
