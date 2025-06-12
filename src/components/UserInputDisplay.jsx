import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const UserInputDisplay = ({ userInput }) => {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 1,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ color: 'rgba(91, 91, 91, 0.7)' }}
        >
          Строка
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'rgba(0, 0, 0, 0.6)',
            minWidth: 24,
            textAlign: 'center'
          }}
        >
          {userInput[0] || '-'}
        </Typography>
      </Box>
      
      <Box sx={{ color: 'rgba(246, 246, 246, 0.3)' }}>/</Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ color: 'rgba(91, 91, 91, 0.7)' }}
        >
          Столбец
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'rgba(0, 0, 0, 0.6)',
            minWidth: 24,
            textAlign: 'center'
          }}
        >
          {userInput[1] || '-'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserInputDisplay;