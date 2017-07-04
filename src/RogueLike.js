import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';
import MapGen from './MapGen';

class RogueLike extends Component {
  constructor(props) {
    super(props);
    this.cols = 80;
    this.rows = 80;
    this.tSize = 12;
    this.state = {
      gameMap: MapGen.createMap(this.rows, this.cols),
      player: {x: 10, y: 10},
      health: 100,
      attack: 10,
      weapon: 'stick',
      level: 1
    }
  }

  initGameMap = () => {
    let gameMap = this.state.gameMap;

    // sets a tile type in a random location on the floor
    const setPiece = (type) => {
      let foundPosition = false;
      while (!foundPosition) {
        let x = Math.floor((Math.random() * this.rows - 1) + 1);
        let y = Math.floor((Math.random() * this.cols - 1) + 1);

        // check if position is the floor and set correct x,y coords
        if (gameMap[y][x] === 1) {
          gameMap[y][x] = type;

          // update player location
          if (type === 'player') {
            let player = {x: x, y: y};
            this.setState({player: player});
          }
          this.setState({gameMap: gameMap});
          foundPosition = true;
        }
      }
    }

    setPiece('player');

    for (let x = 0; x <= 10; x++) {
      // enemy
      setPiece(2);
      // health
      setPiece(3);
      // weapon
      setPiece(4);
    }

  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.initGameMap();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  movePlayer = (x, y) => {
    let gameMap = this.state.gameMap;
    let px = this.state.player.x;
    let py = this.state.player.y;

    switch (gameMap[y][x]) {
      // next move is a wall
      case 1:
        // removes player from present position
        gameMap[py][px] = 1;
        //adds player to new x,y player position
        gameMap[y][x] = 'player';
        let player = {x: x, y: y};
        this.setState({gameMap: gameMap, player: player});
        break;
      // next move is enemy
      case 2:
        console.log('hit enemy');
        break;
      case 3:
        console.log('hit health');
        break;
      case 4:
        console.log('hit weapon');
        break;
      default: break;

    }
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    let px = this.state.player.x;
    let py = this.state.player.y;
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        this.movePlayer(px, py - 1);
        break;
      case 'ArrowDown':
      case 's':
        this.movePlayer(px, py + 1);
        break;
      case 'ArrowLeft':
      case 'a':
        this.movePlayer(px - 1, py);
        break;
      case 'ArrowRight':
      case 'd':
        this.movePlayer(px + 1, py);
        break;
      default:
    }
  }

  render() {
    return (
      <div>
        <TopPanel
          health={this.state.health}
          weapon={this.state.weapon}
          attack={this.state.attack}
          level={this.state.level}
          nxtLvl={100}
          dungeon={1}
        />
        <MapView
          gameMap={this.state.gameMap}
          player={this.state.player}
          tSize={this.tSize}
        />
      </div>
    );
  }
}

export default RogueLike;
