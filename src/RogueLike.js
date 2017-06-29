import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';

class RogueLike extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameMap: []
    }
    this.player = {x: 4, y: 5};
  }

  updateGameMap = (gameMap) => {
    this.setState({gameMap: gameMap});
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    let player = this.player;
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        this.movePlayer(player.x - 1, player.y);
        break;
      case 'ArrowDown':
      case 's':
        this.movePlayer(player.x + 1, player.y);
        break;
      case 'ArrowLeft':
      case 'a':
        this.movePlayer(player.x, player.y - 1);
        break;
      case 'ArrowRight':
      case 'd':
        this.movePlayer(player.x, player.y + 1);
        break;
      default:
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
        <MapView
          gameMap={this.state.gameMap}/>
      </div>
    );
  }
}

export default RogueLike;
