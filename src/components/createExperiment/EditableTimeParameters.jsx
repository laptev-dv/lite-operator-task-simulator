import React, { useState, useEffect } from "react";
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

function EditableTimeParameters({ parameters, onParamChange }) {
  // Конвертер единиц измерения
  const toSeconds = (ms) => (ms / 1000).toFixed(1);
  const toMilliseconds = (s) => Math.round(Number(s) * 1000);

  // Локальное состояние для редактируемых значений (в секундах)
  const [localParams, setLocalParams] = useState({
    stimulusTime: toSeconds(parameters.stimulusTime),
    responseTime: toSeconds(parameters.responseTime),
    pauseTime: toSeconds(parameters.pauseTime),
  });

  const [hoveredItem, setHoveredItem] = useState(null);

  // Синхронизация с props
  useEffect(() => {
    setLocalParams({
      stimulusTime: toSeconds(parameters.stimulusTime),
      responseTime: toSeconds(parameters.responseTime),
      pauseTime: toSeconds(parameters.pauseTime),
    });
  }, [parameters]);

  // Обработчик изменений
  const handleParamChange = (field, value) => {
    const newParams = {
      ...localParams,
      [field]: value,
    };
    setLocalParams(newParams);
    onParamChange({
      [field]: toMilliseconds(value),
    });
  };

  // Рассчитываем производные значения (в миллисекундах)
  const totalTimeMs =
    toMilliseconds(localParams.stimulusTime) +
    toMilliseconds(localParams.responseTime) +
    toMilliseconds(localParams.pauseTime);

  const responsePeriodTimeMs =
    toMilliseconds(localParams.stimulusTime) +
    toMilliseconds(localParams.responseTime);

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

  // Визуализация вертикального прогресс-бара
  const renderTimeBar = () => {
    const stimulusMs = toMilliseconds(localParams.stimulusTime);
    const responseMs = toMilliseconds(localParams.responseTime);
    const pauseMs = toMilliseconds(localParams.pauseTime);

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

  // Рендер строки таблицы с обработчиками наведения курсором
  const renderTableRow = (label, value, color = null, hoverKey = null) => {
    return (
      <TableRow
        onMouseEnter={() => hoverKey && setHoveredItem(hoverKey)}
        onMouseLeave={() => hoverKey && setHoveredItem(null)}
        sx={{
          "&:hover": {
            backgroundColor: hoverKey ? "rgba(0, 0, 0, 0.04)" : "inherit",
            cursor: hoverKey ? "pointer" : "default",
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
            type="number"
            size="small"
            value={value}
            onChange={(e) =>
              handleParamChange(hoverKey + "Time", e.target.value)
            }
            inputProps={{
              min: 0.1,
              step: 0.1,
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
                    cursor: "pointer",
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
                    cursor: "pointer",
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

export default EditableTimeParameters;
