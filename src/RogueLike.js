import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';
import MapGen from './MapGen';

// the gameMap I have created is an Array of rows filled with their columns
//     |-->
//     |-->
//     |-->
//  y \/-----> x
//
// So Initially setting the pieces on the board I use gameMap[y][x] instead of the
// usual x, y then use the normal x, y coord for location on the map

const cols = 80;
const rows = 80;
const tSize = 12;
const weapons = [
  {
    name: 'stick',
    attack: 5,
  },
  {
    name: 'knife',
    attack: 10,
  },
  {
    name: 'gun',
    attack: 15,
  },
  {
    name: 'laser',
    attack: 20,
  },
  {
    name: 'bazooka',
    attack: 25,
  }
];
const tile = {
  WALL: 0,
  FLOOR: 1,
  PLAYER: 'player',
  ENEMY: 2,
  HEALTH: 3,
  WEAPON: 4,
  STAIRS: 5
};

class RogueLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameMap: MapGen.createMap(rows, cols),
      player: {x: 10, y: 10},
      enemies: [],
      weapons: [],
      health: 100,
      attack: 5,
      weapon: 'stick',
      level: 1,
      dungeon: 1
    }
  }

  initGameMap = () => {
    let gameMap = this.state.gameMap;

    // sets a tile type in a random location on the floor
    const setPiece = (type) => {
      let foundPosition = false;
      while (!foundPosition) {
        // create random x,y coord
        let x = Math.floor((Math.random() * rows - 1) + 1);
        let y = Math.floor((Math.random() * cols - 1) + 1);

        if (gameMap[y][x] === tile.FLOOR) {
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
    setPiece(tile.WEAPON);
    setPiece(tile.STAIRS);

    for (let x = 0; x <= 10; x++) {
      setPiece(tile.ENEMY);
      setPiece(tile.HEALTH);
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

    const move = (x, y) => {
      // removes player from present position
      gameMap[py][px] = 1;
      //adds player to new x,y player position
      gameMap[y][x] = 'player';
      let player = {x: x, y: y};
      this.setState({gameMap: gameMap, player: player});
    }

    switch (gameMap[y][x]) {
      case tile.FLOOR:
        move(x, y);
        break;
      case tile.ENEMY:
        console.log('**hit enemy!!');

        break;
      case tile.HEALTH:
        this.setState((prevState) => {
          return {health: prevState.health + 10};
        });
        console.log('**health now ', this.state.health);
        move(x, y);
        break;
      case tile.WEAPON:
        this.setState((prevState)=> {
          console.log('weapon was ',prevState.weapon);
          let index = weapons.map((weapon)=> {
            return weapon.name;
          }).indexOf(prevState.weapon);
          return {weapon: weapons[index + 1].name};
        });
        console.log('weapon is now ',this.state.weapon);
        move(x, y);
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
          tSize={tSize}
        />
      </div>
    );
  }
}

export default RogueLike;
