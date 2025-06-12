import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const FullscreenStimulus = ({ parameters, hiddenPosition }) => {
  const { 
    symbolType,
    symbolColor,
    symbolFont,
    symbolWidth,
    symbolHeight,
    rows,
    columns,
    horizontalPadding,
    verticalPadding,
    backgroundColor
  } = parameters;
  
  const symbolRef = useRef(null);
  const [transform, setTransform] = useState('');

  // Рассчитываем общие размеры сетки
  const totalWidth = columns * (symbolWidth + horizontalPadding) - horizontalPadding;
  const totalHeight = rows * (symbolHeight + verticalPadding) - verticalPadding;

  useEffect(() => {
    if (symbolRef.current) {
      // Создаем временный элемент для измерения
      const temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.style.visibility = 'hidden';
      temp.style.whiteSpace = 'nowrap';
      temp.style.fontFamily = symbolFont;
      temp.style.fontSize = '100px';
      temp.textContent = symbolType;
      document.body.appendChild(temp);
      
      const naturalWidth = temp.offsetWidth;
      const naturalHeight = temp.offsetHeight;
      document.body.removeChild(temp);

      // Рассчитываем масштаб
      const scaleX = symbolWidth / naturalWidth;
      const scaleY = symbolHeight / naturalHeight;
      
      setTransform(`scale(${scaleX}, ${scaleY})`);
    }
  }, [symbolType, symbolFont, symbolWidth, symbolHeight]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <Box
        sx={{
          width: totalWidth,
          height: totalHeight,
          backgroundColor,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${symbolWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${symbolHeight}px)`,
          gap: `${verticalPadding}px ${horizontalPadding}px`,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {Array.from({ length: rows * columns }).map((_, index) => {
          const row = Math.floor(index / columns) + 1;
          const col = (index % columns) + 1;
          const isHidden = hiddenPosition?.row === row && hiddenPosition?.col === col;
          
          return (
            <Typography
              key={`cell-${row}-${col}`}
              ref={symbolRef}
              sx={{
                color: isHidden ? 'transparent' : symbolColor,
                fontFamily: symbolFont,
                fontSize: '100px',
                lineHeight: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transformOrigin: 'center center',
                transform: transform,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                backgroundColor: isHidden ? backgroundColor : 'transparent'
              }}
            >
              {symbolType}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

export default FullscreenStimulus;