import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  TextField,
  Divider,
} from "@mui/material";

const timeColors = {
  stimulus: "#4CAF50",
  response: "#2196F3",
  pause: "#FF9800",
};

const baseHeight = 12;
const maxHeight = 40;

function TimeParameters({ parameters }) {
  // Получаем параметры с дефолтными значениями
  const { stimulusTime, responseTime, pauseTime } = parameters;

  // Конвертер единиц
  const toSeconds = (ms) => (ms / 1000).toFixed(1);

  // Локальные значения (в секундах)
  const localParams = {
    stimulusTime: toSeconds(stimulusTime),
    responseTime: toSeconds(responseTime),
    pauseTime: toSeconds(pauseTime),
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  // Рассчитываем производные значения (в миллисекундах)
  const totalTimeMs =
    (parameters.stimulusTime || 500) +
    (parameters.responseTime || 1000) +
    (parameters.pauseTime || 300);

  const responsePeriodTimeMs =
    (parameters.stimulusTime || 500) + (parameters.responseTime || 1000);

  // Расчет процентов для прогресс-бара
  const calculatePercentage = (timeMs) => (timeMs / totalTimeMs) * 100;

  // Получение ширины сегмента в зависимости от наведения курсором
  const getSegmentHeight = (segment) => {
    if (!hoveredItem) return baseHeight;

    if (hoveredItem === "total") {
      return maxHeight - 16;
    } else if (
      hoveredItem === "responsePeriod" &&
      (segment === "stimulus" || segment === "response")
    ) {
      return maxHeight;
    } else if (hoveredItem === segment) {
      return maxHeight;
    }

    return baseHeight;
  };

  // Визуализация прогресс-бара
  const renderTimeBar = () => {
    const stimulusMs = parameters.stimulusTime || 500;
    const responseMs = parameters.responseTime || 1000;
    const pauseMs = parameters.pauseTime || 300;

    return (
      <Stack direction="row" sx={{ alignItems: "end" }}>
        <Box
          sx={{
            borderRadius: "4px 0 0 4px",
            width: `${calculatePercentage(stimulusMs)}%`,
            height: `${getSegmentHeight("stimulus")}px`,
            backgroundColor: timeColors.stimulus,
            transition: "height 0.3s ease",
          }}
        />
        <Box
          sx={{
            width: `${calculatePercentage(responseMs)}%`,
            height: `${getSegmentHeight("response")}px`,
            backgroundColor: timeColors.response,
            transition: "height 0.3s ease",
          }}
        />
        <Box
          sx={{
            borderRadius: "0 4px 4px 0",
            width: `${calculatePercentage(pauseMs)}%`,
            height: `${getSegmentHeight("pause")}px`,
            backgroundColor: timeColors.pause,
            transition: "height 0.3s ease",
          }}
        />
      </Stack>
    );
  };

  // Рендер строки таблицы с обработчиками наведения курсоров
  const renderTableRow = (label, value, color = null, hoverKey = null) => {
    return (
      <TableRow
        onMouseEnter={() => hoverKey && setHoveredItem(hoverKey)}
        onMouseLeave={() => hoverKey && setHoveredItem(null)}
        sx={{
          "&:hover": {
            backgroundColor: hoverKey ? "rgba(0, 0, 0, 0.04)" : "inherit",
          },
          td: { borderBottom: 0, paddingBottom: 1 },
        }}
      >
        <TableCell>
          {color && (
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: "2px",
              }}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <TextField
            fullWidth
            label={`${label}, сек`}
            size="small"
            value={value}
            disabled
            sx={{
              "& .Mui-disabled": {
                color: "inherit", // Сохраняем цвет текста
                WebkitTextFillColor: "inherit", // Для Safari
              },
            }}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Временные параметры
      </Typography>

      <Stack
        sx={{
          direction: "column",
          alignContent: "end",
        }}
        gap={2}
      >
        <Box sx={{ height: `${maxHeight}px`, alignContent: "end" }}>
          {renderTimeBar()}
        </Box>

        <Stack
          sx={{ width: "100%" }}
          direction="column"
          justifyContent="space-between"
        >
          <Table>
            <TableBody>
              <TableRow
                onMouseEnter={() => setHoveredItem("total")}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  td: { paddingBottom: 1 },
                }}
              >
                <TableCell colSpan={2}>Общее время цикла</TableCell>
                <TableCell>{toSeconds(totalTimeMs)} сек</TableCell>
              </TableRow>
              <TableRow
                onMouseEnter={() => setHoveredItem("responsePeriod")}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  td: { borderBottom: 0, paddingBottom: 1 },
                }}
              >
                <TableCell colSpan={2}>Время на ответ</TableCell>
                <TableCell>{toSeconds(responsePeriodTimeMs)} сек</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider />

          <Table>
            <TableBody>
              {renderTableRow(
                "Предъявление стимула",
                localParams.stimulusTime,
                timeColors.stimulus,
                "stimulus"
              )}
              {renderTableRow(
                "Ожидание ответа",
                localParams.responseTime,
                timeColors.response,
                "response"
              )}
              {renderTableRow(
                "Пауза",
                localParams.pauseTime,
                timeColors.pause,
                "pause"
              )}
            </TableBody>
          </Table>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default TimeParameters;
