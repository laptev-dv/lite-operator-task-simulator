import React from "react";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Chip,
  TextField
} from "@mui/material";
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  AccessTime as TimerIcon,
  Help as MissedIcon
} from "@mui/icons-material";
import { formatDuration } from '../../utils/dateFormatter'

const PresentationNavigation = ({
  currentPresentation,
  currentIndex,
  totalPresentations,
  onPrev,
  onNext
}) => {
  const isCorrect = currentPresentation?.userAnswer?.row ===
    currentPresentation?.correctAnswer?.row &&
    currentPresentation?.userAnswer?.column ===
    currentPresentation?.correctAnswer?.column;

  const answerStatus = !currentPresentation?.userAnswer 
    ? { 
        text: "Пропущен", 
        color: "warning", 
        icon: <MissedIcon fontSize="small" color="warning"/> 
      } 
    : isCorrect 
      ? { 
          text: "Правильно", 
          color: "success", 
          icon: <CorrectIcon fontSize="small" color="success"/> 
        } 
      : { 
          text: "Ошибка", 
          color: "error", 
          icon: <IncorrectIcon fontSize="small" color="error"/> 
        };

  return (
    <Stack spacing={2}>
      {/* Первая строка - навигация, время и результат */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={onPrev} size="small" sx={{ mr: 1 }}>
          <PrevIcon />
        </IconButton>

        <Typography variant="body2">
          {currentIndex + 1} из {totalPresentations}
        </Typography>

        <IconButton onClick={onNext} size="small" sx={{ ml: 1 }}>
          <NextIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Chip
        color={answerStatus.color}
          icon={answerStatus.icon}
          label={
            <Box
                component="span"
                sx={{
                  color:
                    answerStatus.color === "success"
                      ? "success"
                      : answerStatus.color === "error"
                      ? "error"
                      : "warning",
                }}
              >
                {answerStatus.text}
              </Box>
          }
          size="medium"
          variant="outlined"
        />        
        <Chip
        icon={<TimerIcon fontSize="small" />}
        label={
          <>
            {`${formatDuration(currentPresentation.responseTime)}`}
          </>
        }
        size="medium"
        variant="outlined"
      />
      </Stack>

      {/* Вторая строка - ответы */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="Правильный ответ"
          value={
            currentPresentation?.correctAnswer
              ? `Строка ${currentPresentation.correctAnswer.row}, Колонка ${currentPresentation.correctAnswer.column}`
              : "Нет данных"
          }
          InputProps={{
            readOnly: true,
            sx: {
              "& input": {
                cursor: "default",
              },
            },
          }}
          fullWidth
          size="small"
          disabled
        />

        <TextField
          label="Ответ пользователя"
          value={
            currentPresentation?.userAnswer
              ? `Строка ${currentPresentation.userAnswer.row}, Колонка ${currentPresentation.userAnswer.column}`
              : "Нет ответа"
          }
          InputProps={{
            readOnly: true,
            sx: {
              "& input": {
                cursor: "default",
              },
            },
          }}
          fullWidth
          size="small"
          disabled
        />
      </Stack>
    </Stack>
  );
};

export default PresentationNavigation;