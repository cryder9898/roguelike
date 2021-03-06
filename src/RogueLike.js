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
  BOSS: 6,
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
        xp: 0,
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
            hero.loc = {x: x, y: y};
            this.setState({hero: hero});
          }

          gameMap[y][x] = type;
          return {x: x, y: y};
        }
      }
    }

    setPiece('hero');
    setPiece(tile.WEAPON);

    if (this.state.dungeon < 4) {
      setPiece(tile.STAIRS);
    } else {
      // create the boss
      let neighbors = [[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]];
      let pos = setPiece(tile.BOSS);
      neighbors = neighbors.filter((loc, index)=> {
        loc[0] += pos.x;
        loc[1] += pos.y;
        return gameMap[loc[1]][loc[0]] === tile.FLOOR;
      });
      for (let i = 0; i < 3; i++) {
        let x = neighbors[i][0];
        let y = neighbors[i][1];
        gameMap[y][x] = tile.BOSS;
      }
    }

    for (let x = 0; x <= 10; x++) {
      setPiece(tile.ENEMY);
      setPiece(tile.HEALTH);
    }

    this.setState({gameMap: gameMap});
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
        prevState.hero.loc = {x: x, y: y};
        return {gameMap: gameMap, hero: prevState.hero};
      });
    }

    switch (gameMap[y][x]) {
      case tile.FLOOR:
        moveTo(x, y);
        break;

      case tile.BOSS:
      case tile.ENEMY:
        // sort-of unique key
        let key = x.toString()+y.toString();
        let enemies = this.state.enemies;

        if (!this.state.enemies[key]) {
          // create a new Enemy first
          let lvl = this.state.dungeon;
          // push enemy onto the enemies object
          let health;
          if (gameMap[y][x] === tile.BOSS) {
            health = 50;
          } else {
            health = 20;
          }
          enemies[key] = new Enemy(health*lvl, 15*lvl);
          this.setState({enemies: enemies});
        }

        let enemy = enemies[key];
        let hero = this.state.hero;
        //player attacks first
        enemy.health -= hero.attack;
        // enemy attacks
        hero.health -= Math.floor(enemy.attack/hero.level);
        this.setState({
          log: 'ATTACK!! Hero: ' + hero.health + ' Enemy: ' + enemy.health
        });

        if (hero.health <= 0) {
          this.setState({
            log: '*** GAME OVER ***',
            play: false,
            gameMap: MapGen.createMap(rows, cols),
            hero: {
              loc: {x: 10, y: 10},
              health: 100,
              attack: 5,
              weapon: 'stick',
              level: 1,
              xp: 0,
            },
            enemies: {},
            weapons: [],
            dungeon: 1,
          });
          this.initGameMap();
        } else {
          if (enemy.health <= 0) {
            // enemy is defeated
            delete enemies[key];
            this.setState((prevState)=> {
              const XP = 20;
              prevState.hero.xp += XP;
              if (prevState.hero.xp >= 100) {
                // if hero has 100 xp he levels up
                prevState.hero.level++;
                prevState.hero.attack += 5;

                // reset xp
                prevState.hero.xp = 0;
              }
              return {
                enemies: enemies,
                log: 'You killed the Enemy and received ' + XP + ' XP',
                hero: prevState.hero,
              }
            });
            moveTo(x, y);
          }
        }
        break;

      case tile.HEALTH:
        const health = 10;

        this.setState((prevState) => {
          prevState.hero.health += health;
          return {
            hero: prevState.hero,
            log: 'You found Health! +' + health
          };
        });
        moveTo(x, y);
        break;

      case tile.WEAPON:
        this.setState((prevState)=> {
          let lastWeapon = prevState.hero.weapon;
          // changes weapon to best weapon based on dungeon
          prevState.hero.weapon = weapons[this.state.dungeon].name;
          prevState.hero.attack += weapons[this.state.dungeon].attack;
          return {
            log: 'You dropped the ' + lastWeapon + ' and picked up the ' + prevState.hero.weapon,
            hero: prevState.hero
          };
        });
        moveTo(x, y);
        break;

      case tile.STAIRS:
        this.setState((prevState)=> {
          let gameMap = MapGen.createMap(rows, cols);
          return {
            log: 'You walked down the stairs to the next dungeon!',
            gameMap: gameMap,
            dungeon: prevState.dungeon + 1
          }
        });
        this.initGameMap();
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
          nxtlvl={100 - this.state.hero.xp}
          dungeon={this.state.dungeon}
        />
        <Log log={this.state.log}/>
        {this.state.play ?
          <MapView
            gameMap={this.state.gameMap}
            heroPos={this.state.hero.loc}
            tSize={tSize}
          />
          :
          <button onClick={()=>{this.setState({play: true, log: ''})}}>Play</button>
        }
      </div>
    );
  }
}

export default RogueLike;
