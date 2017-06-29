import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';

class RogueLike extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <TopPanel
          health={100}
          weapon={'stick'}
          attack={10}
          level={1}
          nxtLvl={100}
          dungeon={1}
        />
        <MapView />
      </div>
    );
  }
}

export default RogueLike;
