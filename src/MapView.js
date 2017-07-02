import React from 'react';

const MapView = ({gameMap, rows, cols, tSize}) => {

  const style = {
    'margin': '0 auto',
    'lineHeight': 0
  };

  const renderTile = (tile) => {
    switch(tile) {
      case 0: return 'wall';
      case 1: return 'floor';
      case 'player': return 'player';
      default: return 'floor';
    }
  }

  return (
    <div style={style}>
      {gameMap.map((row, i) => {
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
