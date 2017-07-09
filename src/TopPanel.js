import React from 'react';

const TopPanel = ({health, weapon, attack, level, nxtlvl, dungeon}) => {
  return (
    <div className='top-panel'>
     <div>Health: {health}</div>
     <div>Weapon: {weapon}</div>
     <div>Attack: {attack}</div>
     <div>Level: {level}</div>
     <div>XP to Next Level: {nxtlvl}</div>
     <div>Dungeon: {dungeon}</div>
    </div>
  );
}

export default TopPanel;
