import React, { Component } from 'react';
import TopPanel from './TopPanel';
import MapView from './MapView';
import MapGen from './MapGen';
import Log from './Log';

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
  HERO: 'hero',
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
      hero: {
        loc: {x: 10, y: 10},
        health: 100,
        attack: 5,
        weapon: 'stick',
        level: 1,
      },
      enemies: {},
      weapons: [],
      dungeon: 1,
      log: ''
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

          if (type === 'hero') {
            let hero = this.state.hero
            let pLoc = {x: x, y: y};
            hero.loc = pLoc;
            this.setState({hero: hero});
          }

          gameMap[y][x] = type;

          this.setState({gameMap: gameMap});
          foundPosition = true;
        }
      }
    }

    setPiece('hero');
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
    let hx = this.state.hero.loc.x;
    let hy = this.state.hero.loc.y;

    const moveTo = (x, y) => {
      this.setState((prevState) => {
        // removes hero from present position
        gameMap[hy][hx] = tile.FLOOR;
        //adds player to new x,y player position
        gameMap[y][x] = 'hero';
        let hLoc = {x: x, y: y};
        prevState.hero.loc = hLoc;
        return {gameMap: gameMap, hero: prevState.hero};
      });
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
          // push enemy onto the enemies object
          enemies[key] = new Enemy(20*lvl, 10*lvl);
          this.setState({enemies: enemies});
        }
        this.setState({log: 'attack!!'});
        let enemies = this.state.enemies;
        let enemy = enemies[key];
        let hero = this.state.hero;
        //player attacks first
        enemy.health -= this.state.hero.attack;
        // enemy attacks
        hero.health -= enemy.attack;
        console.log('hero',hero.health,'enemy',enemy.health);

        if (hero.health <= 0) {
          this.setState({log: '***YOU DIED!****'});
        }

        if (enemy.health <= 0) {
          this.setState({log: 'you killed the enemy!!'});
          moveTo(x, y);
          enemies[key] = null;
        }

        enemies[key] = enemy;
        this.setState({hero: hero, enemies: enemies});
        console.log(this.state.enemies);
        break;

      case tile.HEALTH:
        this.setState((prevState) => {
          prevState.hero.health += 10;
          return {hero: prevState.hero};
        });
        this.setState({log: 'You found Health!'});
        moveTo(x, y);
        break;

      case tile.WEAPON:
        this.setState((prevState)=> {
          // locate in weapon array and grab next one
          let index = weapons.map((weapon)=> {
            return weapon.name;
          }).indexOf(prevState.hero.weapon);
          prevState.hero.weapon = weapons[index + 1].name;
          prevState.hero.attack = weapons[index + 1].attack;
          return {
            log: 'You dropped the '+weapons[index].name+' and picked up the '+this.state.hero.weapon,
            hero: prevState.hero
          };
        });
        moveTo(x, y);
        break;

      case tile.STAIRS:
        this.setState({log: 'Walk down the stairs to the next dungeon!'});
        break;

      default: break;
    }
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    let hx = this.state.hero.loc.x;
    let hy = this.state.hero.loc.y;
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        this.attemptMoveOn(hx, hy - 1);
        break;
      case 'ArrowDown':
      case 's':
        this.attemptMoveOn(hx, hy + 1);
        break;
      case 'ArrowLeft':
      case 'a':
        this.attemptMoveOn(hx - 1, hy);
        break;
      case 'ArrowRight':
      case 'd':
        this.attemptMoveOn(hx + 1, hy);
        break;
      default:
    }
  }

  render() {
    return (
      <div>
        <TopPanel
          health={this.state.hero.health}
          weapon={this.state.hero.weapon}
          attack={this.state.hero.attack}
          level={this.state.hero.level}
          nxtLvl={100}
          dungeon={1}
        />
        <Log log={this.state.log}/>
        <MapView
          gameMap={this.state.gameMap}
          heroPos={this.state.hero.loc}
          tSize={tSize}
        />
      </div>
    );
  }
}

export default RogueLike;
