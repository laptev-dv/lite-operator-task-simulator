import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Slider,
  Stack,
} from "@mui/material";

const EditableSeriesSettings = ({
  parameters,
  onParamChange,
  tasksCount = 1,
}) => {
  const renderEditableRow = (
    label,
    field,
    value,
    type = "text",
    unit = null,
    min = null,
    max = null
  ) => (
    <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
      <TableCell>
        <TextField
          size="small"
          fullWidth
          type={type}
          label={`${label}${unit !== null ? `, ${unit}` : ""}`}
          value={value}
          onChange={(e) => {
            let val =
              type === "number" ? Number(e.target.value) : e.target.value;

            // Применяем ограничения
            if (type === "number") {
              if (min !== null && val < min) val = min;
              if (max !== null && val > max) val = max;
            }

            onParamChange(field, val);
          }}
          inputProps={{
            min,
            max,
          }}
        />
      </TableCell>
    </TableRow>
  );

  const handleEfficiencyChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    const [min, max] = newValue;

    if (activeThumb === 0) {
      onParamChange("efficiencyMin", Math.min(min, parameters.efficiencyMax));
    } else {
      onParamChange("efficiencyMax", Math.max(max, parameters.efficiencyMin));
    }
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Настройка серии
        </Typography>
        <Table>
          <TableBody>
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Режим</InputLabel>
                  <Select
                    label="Режим"
                    value={parameters.mode}
                    onChange={(e) => onParamChange("mode", e.target.value)}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="adaptive">Адаптивный</MenuItem>
                    <MenuItem value="strict">Жесткий</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
            {parameters.mode === "adaptive" &&
              renderEditableRow(
                "Номер начальной задачи",
                "initialTaskNumber",
                parameters.initialTaskNumber,
                "number",
                null,
                1, // min
                tasksCount // max
              )}
            {renderEditableRow(
              "Количество предъявлений в задаче",
              "presentationsPerTask",
              parameters.presentationsPerTask,
              "number",
              "шт",
              1 // min
            )}
            {parameters.mode === "adaptive" &&
              renderEditableRow(
                "Время на серию",
                "seriesTime",
                parameters.seriesTime,
                "number",
                "мин",
                1 // min
              )}
            {parameters.mode === "adaptive" && (
              <>
                <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
                <TableCell>
                    <Stack direction='row' justifyContent="space-between" alignItems='center' spacing={8} sx={{mt:2}}>
                    <Typography variant="body2">Эффективность,&nbsp;%</Typography>
                    <Slider
                      valueLabelFormat={(value) => `${value}%`}
                      value={[
                        parameters.efficiencyMin,
                        parameters.efficiencyMax,
                      ]}
                      onChange={(e, newValue, activeThumb) =>
                        handleEfficiencyChange(e, newValue, activeThumb)
                      }
                      valueLabelDisplay="on"
                      min={0}
                      max={100}
                      step={1}
                      disableSwap
                      sx={{
                        mt: 2,
                        "& .MuiSlider-valueLabel": {
                          backgroundColor: "primary.main",
                          borderRadius: 1,
                        },
                      }}
                    />
                    </Stack>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default EditableSeriesSettings;
