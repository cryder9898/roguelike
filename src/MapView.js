import React from 'react';

const MapView = ({gameMap, player, tSize}) => {

  const windowHeight = 10;
  const windowWidth = 10;
  let window = [];

  // corners of the window
  let top = player.y - windowHeight/2;
  let bottom = player.y + windowHeight/2;
  let left = player.x - windowWidth/2;
  let right = player.x + windowWidth/2;

  // setting the window to the gameMap
  for (let r = top; r <= bottom; r++) {
    let row = [];
    for (let c = left; c <= right; c++) {
      row.push(gameMap[r][c]);
    }
    window.push(row);
  }

  const renderTile = (tile) => {
    switch(tile) {
      case 0: return 'wall';
      case 1: return 'floor';
      case 'player': return 'player';
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
