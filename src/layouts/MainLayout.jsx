import { Box } from '@mui/material';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Шапка приложения */}
      <Header />

      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
