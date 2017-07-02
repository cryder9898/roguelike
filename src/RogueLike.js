import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';
import MapGen from './MapGen';

class RogueLike extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameMap: []
    }
    this.cols = 100;
    this.rows = 100;
    this.player = {x: 0, y: 0};
    this.tSize = 12;
  }

  initGameMap = () => {
    let gameMap = MapGen.createMap(this.cols, this.rows);
    let foundPosition = false;
    while (!foundPosition) {
      let x = Math.floor(Math.random() * this.cols);
      let y = Math.floor(Math.random() * this.rows);
      if (gameMap[x][y] === 1) {
        gameMap[x][y] = 'player';
        this.player = {x: x, y: y};
        console.log(this.player);
        foundPosition = true;
      }
    }
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
    let px = this.player.x;
    let py = this.player.y;
    console.log('prevMove: ['+px+','+py+']');
    console.log('nextMove: ['+x+','+y+']');
    if (gameMap[x][y] === 1) {

      // removes player from present position
      gameMap[px][py] = 1;
      //adds player to new x,y player position
      gameMap[x][y] = 'player';
      this.player = {x, y};
      this.updateGameMap(gameMap);
    }
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    let px = this.player.x;
    let py = this.player.y;
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        this.movePlayer(px - 1, py);
        break;
      case 'ArrowDown':
      case 's':
        this.movePlayer(px + 1, py);
        break;
      case 'ArrowLeft':
      case 'a':
        this.movePlayer(px, py - 1);
        break;
      case 'ArrowRight':
      case 'd':
        this.movePlayer(px, py + 1);
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
