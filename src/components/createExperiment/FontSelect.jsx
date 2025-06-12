import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const CACHE_KEY = 'google-fonts-cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 часа

const FontSelect = ({ value, onChange }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для предварительной загрузки всех шрифтов
  const preloadFonts = (fontFamilies) => {
    fontFamilies.forEach(fontFamily => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        // Проверяем кэш
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedData = cached ? JSON.parse(cached) : null;
        
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          setFonts(cachedData.fonts);
          preloadFonts(cachedData.fonts); // Предзагружаем шрифты из кэша
          setLoading(false);
          return;
        }

        // Получаем список шрифтов из Google Fonts API
        const response = await axios.get(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgJzM14xNhFsgMoPqMcw14eSmfoIfgPd0&sort=popularity'
        );
        
        const popularFonts = response.data.items
          .filter(font => font.subsets.includes('cyrillic'))
          .map(font => font.family);
        
        // Сохраняем в кэш
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          fonts: popularFonts,
          timestamp: Date.now()
        }));
        
        setFonts(popularFonts);
        preloadFonts(popularFonts); // Предзагружаем новые шрифты
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fonts:', error);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedFonts = JSON.parse(cached).fonts;
          setFonts(cachedFonts);
          preloadFonts(cachedFonts); // Предзагружаем шрифты из кэша в случае ошибки
        }
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  return (
    <Autocomplete
      fullWidth
      size='small'
      options={fonts}
      value={value}
      disableClearable
      onChange={(event, newValue) => onChange(newValue)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Шрифт"
          variant='outlined'
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box 
          component="li" 
          {...props}
          sx={{ 
            fontFamily: option,
            '&:not(:hover)': {
              backgroundColor: 'background.paper' // Убираем серый фон при наведении
            }
          }}
        >
          {option}
        </Box>
      )}
    />
  );
};

export default FontSelect;