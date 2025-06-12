import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      {/* Иконка */}
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />

      {/* Заголовок */}
      <Typography variant="h4" gutterBottom>
        Страница не найдена
      </Typography>

      {/* Описание */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        Извините, запрашиваемая страница не существует.
      </Typography>

      {/* Кнопка для возврата на главную страницу */}
      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{ mt: 2 }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
}

export default NotFoundPage;