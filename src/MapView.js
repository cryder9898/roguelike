import React from 'react';

const MapView = ({gameMap, rows, cols, tSize}) => {

  const style = {
    'width': tSize*cols,
    'lineHeight': 0
  };

  return (
    <div style={style}>
      {gameMap.map((tile, i) => {
        return (
          <div
            key={i}
            className={tile === 'player' ? 'player' : 'floor'}
          />
        )
      })}
    </div>
  );
}

export default MapView;
