import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

function ExperimentLayout() {
  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Outlet />
    </Box>
  );
}

export default ExperimentLayout;