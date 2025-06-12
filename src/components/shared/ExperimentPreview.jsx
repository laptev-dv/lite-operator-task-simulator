import React from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Fullscreen as FullscreenIcon, Close as CloseIcon } from "@mui/icons-material";
import StimulusPreview from "./StimulusPreview";

// Функция для определения яркости цвета (возвращает значение от 0 до 255)
const getBrightness = (hexColor) => {
  // Удаляем # если есть
  const color = hexColor.replace(/^#/, '');
  // Конвертируем в RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Формула для расчета яркости
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const ExperimentPreview = ({ parameters }) => {
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  // Определяем цвет кнопки закрытия на основе яркости фона
  const backgroundColor = parameters.backgroundColor || "#ffffff";
  const isDarkBackground = getBrightness(backgroundColor) < 128;
  const closeButtonColor = isDarkBackground ? "common.white" : "common.black";

  return (
    <>
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        PaperProps={{
          sx: {
            backgroundColor: backgroundColor,
          },
        }}
      >
        <DialogActions>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleFullscreenClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 40,
              top: 40,
              color: closeButtonColor,
              '&:hover': {
                backgroundColor: isDarkBackground 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StimulusPreview parameters={parameters} />
        </DialogContent>
      </Dialog>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          height: '100%'
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            startIcon={<FullscreenIcon />}
            size="small"
            onClick={handleFullscreenOpen}
          >
            Полный экран
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            overflow: "hidden",
            backgroundColor: backgroundColor,
            borderRadius: "4px",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StimulusPreview parameters={parameters} />
        </Box>
      </Paper>
    </>
  );
};

export default ExperimentPreview;