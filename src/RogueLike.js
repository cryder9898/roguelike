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

class Enemy {
  constructor(health, attack) {
    this.health = health;
    this.attack = attack;
  }

  getHealth() {
    return this.health;
  }

  getAttack() {
    return this.attack;
  }
}

const tile = {
  WALL: 0,
  FLOOR: 1,
  PLAYER: 'player',
  ENEMY: 2,
  HEALTH: 3,
  WEAPON: 4,
  STAIRS: 5,
};

class RogueLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: null,
      gameMap: MapGen.createMap(rows, cols),
      player: {x: 10, y: 10},
      enemies: {},
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

          if (type === 'player') {
            let player = {x: x, y: y};
            this.setState({player: player});
          }

          gameMap[y][x] = type;

          this.setState({gameMap: gameMap});
          foundPosition = true;
        }

        //return {x, y};
      }
    }

    setPiece('player');
    setPiece(tile.WEAPON);
    setPiece(tile.STAIRS);

    for (let x = 0; x <= 10; x++) {
      // TODO setup enemies on map
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

  attemptMoveOn = (x, y) => {
    let gameMap = this.state.gameMap;
    let px = this.state.player.x;
    let py = this.state.player.y;

    const moveTo = (x, y) => {
      // removes player from present position
      gameMap[py][px] = 1;
      //adds player to new x,y player position
      gameMap[y][x] = 'player';
      let player = {x: x, y: y};
      this.setState({gameMap: gameMap, player: player});
    }

    switch (gameMap[y][x]) {
      case tile.FLOOR:
        moveTo(x, y);
        break;

      case tile.ENEMY:
        // sort-of unique key
        let key = x.toString()+y.toString();

        if (!this.state.enemies[key]) {
          // create a new Enemy first
          console.log('You look new!!')
          let key = x.toString()+y.toString();
          let enemies = this.state.enemies;
          let lvl = this.state.dungeon;

          enemies[key] = new Enemy(20*lvl, 5*lvl);
          this.setState({enemies: enemies});
        }
        console.log('*attack!!*');
        let enemies = this.state.enemies;
        let enemy = enemies[key];
        let pHealth = this.state.health;
        //player attacks first
        enemy.health -= this.state.attack;
        // enemy attacks
        pHealth -= enemy.attack;
        console.log('player',pHealth,'enemy',enemy.health);

        if (pHealth <= 0) {
          console.log('***YOU DIED!****');
        }

        if (enemy.health <= 0) {
          console.log('you killed the enemy!!');
          moveTo(x, y);
          enemies[key] = null;
        }
        
        enemies[key] = enemy;
        this.setState({health: pHealth, enemies: enemies});
        console.log(this.state.enemies);
        break;

      case tile.HEALTH:
        this.setState((prevState) => {
          return {health: prevState.health + 10};
        });
        console.log('**health now ', this.state.health);
        moveTo(x, y);
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
        moveTo(x, y);
        break;

      case tile.STAIRS:
        console.log('*** hit stairs');
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
        this.attemptMoveOn(px, py - 1);
        break;
      case 'ArrowDown':
      case 's':
        this.attemptMoveOn(px, py + 1);
        break;
      case 'ArrowLeft':
      case 'a':
        this.attemptMoveOn(px - 1, py);
        break;
      case 'ArrowRight':
      case 'd':
        this.attemptMoveOn(px + 1, py);
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
