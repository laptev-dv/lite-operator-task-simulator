import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  AccessTime as TimerIcon,
  Help as MissedIcon,
} from "@mui/icons-material";
import StimulusPreview from "../shared/StimulusPreview";
import PresentationNavigation from "./PresentationNavigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

const getBrightness = (hexColor) => {
  const color = hexColor.replace(/^#/, "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const CustomizedDot = (props) => {
  const { cx, cy, payload, stroke, strokeWidth } = props;
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={6}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={payload.color}
    />
  );
};

const SessionDetailsPreview = ({ parameters }) => {
  const theme = useTheme();
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handlePrev = () => {
    setCurrentPresentationIndex((prev) =>
      prev > 0 ? prev - 1 : parameters.presentations.length - 1
    );
  };

  const handleNext = () => {
    setCurrentPresentationIndex((prev) =>
      prev < parameters.presentations.length - 1 ? prev + 1 : 0
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentPresentation = parameters.presentations[currentPresentationIndex];

  const backgroundColor = parameters.task.backgroundColor || "#ffffff";
  const isDarkBackground = getBrightness(backgroundColor) < 128;
  const textColor = isDarkBackground ? "common.white" : "common.black";
  const buttonColor = isDarkBackground
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  // Подготовка данных для графика
  const chartData = parameters.presentations.map((pres, index) => {
    const hasAnswer = !!pres.userAnswer;
    const isCorrect = hasAnswer && 
      pres.userAnswer.row === pres.correctAnswer.row && 
      pres.userAnswer.column === pres.correctAnswer.column;
    
    const answerStatus = !hasAnswer 
      ? { 
          text: "Пропущен", 
          color: theme.palette.warning.main,
          icon: <MissedIcon fontSize="small" color="warning" />
        } 
      : isCorrect 
        ? { 
            text: "Правильно", 
            color: theme.palette.success.main,
            icon: <CorrectIcon fontSize="small" color="success" />
          } 
        : { 
            text: "Ошибка", 
            color: theme.palette.error.main,
            icon: <IncorrectIcon fontSize="small" color="error" />
          };

    return {
      presentation: index + 1,
      time: pres.responseTime / 1000,
      isCurrent: index === currentPresentationIndex,
      ...answerStatus
    };
  });

  if (!currentPresentation) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Нет данных для отображения
        </Typography>
      </Paper>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ 
          p: 2, 
          display: "flex", 
          flexDirection: "column", 
          gap: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        }} elevation={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              Предъявление {label}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <TimerIcon fontSize="small" color="action" />
            <Typography variant="body2">Время реакции:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {data.time.toFixed(2)} сек
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {data.icon}
            <Typography variant="body2" fontWeight="bold" color={data.color}>
              {data.text}
            </Typography>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (activeTab === "details") {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor,
              borderRadius: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <StimulusPreview
              parameters={parameters.task}
              hiddenPosition={{
                row: currentPresentation.correctAnswer?.row,
                col: currentPresentation.correctAnswer?.column,
              }}
            />
          </Box>
          <PresentationNavigation
            currentPresentation={currentPresentation}
            currentIndex={currentPresentationIndex}
            totalPresentations={parameters.presentations.length}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      );
    }

    if (activeTab === "timeChart") {
      return (
        <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 16, bottom: 30 }}
              // Отключаем все анимации
              animationDuration={0}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider} 
                vertical={false}
              />
              <XAxis
                dataKey="presentation"
                tick={{ fill: theme.palette.text.secondary }}
                tickMargin={10}
                label={{
                  value: "Номер предъявления",
                  position: "insideBottom",
                  offset: -15,
                  fill: theme.palette.text.primary,
                }}
              />
              <YAxis
                tick={{ fill: theme.palette.text.secondary }}
                tickMargin={10}
                label={{
                  value: "Время (сек)",
                  angle: -90,
                  position: "insideLeft",
                  fill: theme.palette.text.primary,
                }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{
                  stroke: theme.palette.divider,
                  strokeWidth: 1,
                  strokeDasharray: "5 5"
                }}
                // Отключаем анимацию появления тултипа
                animationDuration={0}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke={theme.palette.text.primary}
                strokeWidth={1}
                dot={<CustomizedDot stroke={theme.palette.background.paper} strokeWidth={2} />}
                activeDot={<CustomizedDot stroke={theme.palette.background.paper} strokeWidth={3} />}
                // Отключаем анимацию линии
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        PaperProps={{ sx: { backgroundColor } }}
      >
        <DialogActions>
          <IconButton
            edge="end"
            onClick={handleFullscreenClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 40,
              top: 40,
              color: textColor,
              "&:hover": { backgroundColor: buttonColor },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StimulusPreview
            parameters={{
              ...parameters.task,
            }}
            hiddenPosition={{
              row: currentPresentation.correctAnswer?.row,
              col: currentPresentation.correctAnswer?.column,
            }}
          />
          <Paper
            elevation={2}
            sx={{
              p: 1,
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
          >
            <PresentationNavigation
              currentPresentation={currentPresentation}
              currentIndex={currentPresentationIndex}
              totalPresentations={parameters.presentations.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </Paper>
        </DialogContent>
      </Dialog>

      <Paper
        elevation={3}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          m={2}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              minHeight: 40,
              '& .MuiTab-root': { 
                minHeight: 40,
                padding: '6px 12px',
              }
            }}
          >
            <Tab label="Детали" value="details" />
            <Tab label="Время" value="timeChart" />
          </Tabs>

          {activeTab === "details" && (
            <Button
              startIcon={<FullscreenIcon />}
              size="small"
              onClick={handleFullscreenOpen}
              sx={{ height: 40 }}
            >
              Полный экран
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            height: "100%",
            flexGrow: 1,
            overflow: "hidden",
            m: 2,
            mt: 0,
          }}
        >
          {renderContent()}
        </Box>
      </Paper>
    </>
  );
};

export default SessionDetailsPreview;