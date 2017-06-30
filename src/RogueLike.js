import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';

class RogueLike extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameMap: []
    }
    this.cols = 40;
    this.rows = 40;
    this.player = {x: 4, y: 5};
    this.tSize = 12;
  }

  getPos = (col, row) => {
    return row * this.cols + col;
  }

  initGameMap = () => {
    let size = this.cols * this.rows;
    console.log(size);
    let gameMap = Array(size).fill(1);
    let playerPos = this.getPos(this.player.x, this.player.y);
    gameMap[playerPos] = 'player';
    this.updateGameMap(gameMap);
  }

  updateGameMap = (gameMap) => {
    this.setState({gameMap: gameMap});
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

    if (gameMap[this.getPos(x, y)] === 1) {
      let pos = this.getPos(this.player.x, this.player.y);
      // removes player from present position
      gameMap[pos] = 1;
      //adds player to newPlayerLoc player position
      gameMap[this.getPos(x, y)] = 'player';
      this.player = {x, y};
      this.updateGameMap(gameMap);
    }
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    let player = this.player;
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        this.movePlayer(player.x, player.y - 1);
        break;
      case 'ArrowDown':
      case 's':
        this.movePlayer(player.x, player.y + 1);
        break;
      case 'ArrowLeft':
      case 'a':
        this.movePlayer(player.x - 1, player.y);
        break;
      case 'ArrowRight':
      case 'd':
        this.movePlayer(player.x + 1, player.y);
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
          rows={this.rows}
          cols={this.cols}
          tSize={this.tSize}
        />
      </div>
    );
  }
}

export default RogueLike;
