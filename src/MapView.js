import React from 'react';

const MapView = ({gameMap, player, tSize}) => {

  const windowHeight = 20;
  const windowWidth = 20;
  let window = [];

  // corners of the window
  let top = player.y - windowHeight/2;
  if (top <= 0) {top = 0};
  let bottom = player.y + windowHeight/2;
  if (bottom >= 79) {bottom = 79};
  let left = player.x - windowWidth/2;
  if (left <= 0) {left = 0};
  let right = player.x + windowWidth/2;
  if (right >= 79) {right = 79};

  console.log('player: ', 'row', player.y, 'col', player.x);
  console.log('top',top);
  console.log('left',left,'right',right);
  console.log('bottom',bottom);
  
  // updating window
  for (let r = top; r <= bottom; r++) {
    let row = [];
    for (let c = left; c <= right; c++) {
;      if (gameMap[r][c] === undefined) {
        row.push(0);
      } else {
        row.push(gameMap[r][c]);
      }
    }
    window.push(row);
  }

  const renderTile = (tile) => {
    switch(tile) {
      case 0: return 'wall';
      case 1: return 'floor';
      case 'player': return 'player';
      case 2: return 'enemy';
      case 3: return 'health';
      case 4: return 'weapon';
      default: return 'floor';
    }
  }

  const gridStyle = {
    'padding': '10px',
    'backgroundColor': 'blue',
    'margin': 'auto',
    'lineHeight': 0,
    'width': tSize * windowWidth
  };

  return (
    <div style={gridStyle}>
      {window.map((row, i) => {
        return (
          <div key={i}>
            {row.map((tile, j) => {
              return (
                <div
                  key={[i,j]}
                  className={renderTile(tile)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default MapView;
