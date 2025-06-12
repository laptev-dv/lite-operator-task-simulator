import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Tooltip,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import ClockIcon from "@mui/icons-material/AccessTime";
import { formatSimpleDuration } from '../utils/dateFormatter'

const ProgressContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  top: 8,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1100,
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  padding: 4,
  minWidth: 300,
}));

const PhaseDot = styled(Box)(({ phase }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor:
    phase === "stimulus"
      ? "#66bb6a"
      : phase === "response"
      ? "#42a5f5"
      : "#bdbdbd",
}));

const ExperimentProgressBar = ({
  currentPhase,
  phaseTimeLeft,
  currentTask,
  presentationCount,
  presentationsPerTask,
  mode,
  seriesTimeLeft,
  onInterrupt,
}) => {
  const phaseLabels = {
    stimulus: "Стимул",
    response: "Ответ",
    pause: "Пауза",
  };

  return (
    <ProgressContainer>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        {/* Индикатор фазы */}
        <Stack direction="row" spacing={1} alignItems="center" minWidth={64}>
          <PhaseDot phase={currentPhase} />
          <Typography
            variant="caption"
            fontSize="0.75rem"
            color="text.secondary"
          >
            {phaseLabels[currentPhase]}
          </Typography>
        </Stack>

        {/* Разделитель */}
        <Box sx={{ color: "#e0e0e0" }}>|</Box>

        {/* Прогресс задачи */}
        <Tooltip title={`Задача: ${currentTask?.name || "Нет данных"}`}>
          <Typography
            variant="caption"
            fontSize="0.75rem"
            color="text.secondary"
          >
            Предъявление {presentationCount}/{presentationsPerTask}
          </Typography>
        </Tooltip>

        {/* Общее время для адаптивного режима */}
        {mode === "adaptive" && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ color: "#e0e0e0" }}>|</Box>
            <ClockIcon
              sx={{ color: "text.secondary", width: 16, aspectRatio: 1 }}
            />
            <Typography
              variant="caption"
              fontSize="0.75rem"
              color="text.secondary"
            >
              {formatSimpleDuration(seriesTimeLeft)}
            </Typography>
          </Stack>
        )}

        {/* Кнопка прерывания */}
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onInterrupt}
          sx={{
            ml: "auto",
            fontSize: "0.7rem",
            py: 0,
            "& .MuiButton-label": {
              fontSize: "0.7rem",
            },
          }}
        >
          Прервать
        </Button>
      </Stack>
    </ProgressContainer>
  );
};

export default ExperimentProgressBar;
