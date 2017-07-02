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
      player: {x: 10, y: 10}
    }
  }

  initGameMap = () => {
    let gameMap = this.state.gameMap;
    let foundPosition = false;
    while (!foundPosition) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.cols);
      if (gameMap[y][x] === 1) {
        gameMap[y][x] = 'player';
        this.updatePlayer(x, y);
        foundPosition = true;
      }
    }
    this.updateGameMap(gameMap);
  }

  updateGameMap = (gameMap) => {
    this.setState({gameMap: gameMap});
  }

  updatePlayer = (x, y) => {
    let player = {x: x, y: y};
    this.setState({player: player});
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.initGameMap();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  movePlayer = (x, y) => {

    // checking if the new move is a wall or not
    let gameMap = this.state.gameMap;
    let px = this.state.player.x;
    let py = this.state.player.y;
    if (gameMap[y][x] === 1) {

      // removes player from present position
      gameMap[py][px] = 1;
      //adds player to new x,y player position
      gameMap[y][x] = 'player';
      this.updatePlayer(x, y);
      this.updateGameMap(gameMap);
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
          health={100}
          weapon={'stick'}
          attack={10}
          level={1}
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
