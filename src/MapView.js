import React from 'react';

const MapView = ({gameMap, heroPos, tSize}) => {

  const windowHeight = 10;
  const windowWidth = 10;
  let window = [];

  // corners of the window
  let top = heroPos.y - windowHeight/2;
  let bottom = heroPos.y + windowHeight/2;
  let left = heroPos.x - windowWidth/2;
  let right = heroPos.x + windowWidth/2;

  // updating window
  for (let r = top; r <= bottom; r++) {
    let row = [];
    for (let c = left; c <= right; c++) {
      try {
        if (gameMap[r][c] === undefined) {
          // handles left and right out of bounds
          row.push(0);
        } else {
          row.push(gameMap[r][c]);
        }
      }
      catch (err) {
        // handles top and bottom out of bounds
        row.push(0);
      }
    }
    window.push(row);
  }

  const renderTile = (tile) => {
    switch(tile) {
      case 0: return 'wall';
      case 1: return 'floor';
      case 'hero': return 'hero';
      case 2: return 'enemy';
      case 3: return 'health';
      case 4: return 'weapon';
      case 5: return 'stairs';
      case 6: return 'boss';
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
