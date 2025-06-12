import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import ColorPickerButton from "../ColorPickerButton";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";
import Link from "@mui/icons-material/Link";
import LinkOff from "@mui/icons-material/LinkOff";

const EditableExperimentGeneralParams = ({ parameters, onParamChange }) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  const aspectRatioLocked = parameters.aspectRatioLocked

  // Обновляем натуральные размеры при изменении шрифта или символа
  useEffect(() => {
    const temp = document.createElement("div");
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.fontFamily = parameters.symbolFont;
    temp.style.fontSize = "100px";
    temp.textContent = parameters.symbolType;
    document.body.appendChild(temp);

    const width = temp.offsetWidth;
    const height = temp.offsetHeight;
    document.body.removeChild(temp);


    // Пересчитываем соотношение сторон
    const newAspectRatio = width / height;
    setAspectRatio(newAspectRatio);

    let newParams = {
      symbolHeight: Math.round(parameters.symbolWidth / newAspectRatio),
    }

    // Автоматически включаем блокировку при изменении шрифта/символа
    if (!aspectRatioLocked) {
      newParams.aspectRatioLocked = true;
    }
    
    // Обновляем высоту в соответствии с новой пропорцией
    onParamChange(newParams);
  }, [parameters.symbolFont, parameters.symbolType]);

  // Обработчик изменений параметров
  const handleParamChange = (field, value) => {
    const numericValue = Number(value);
    const changes = { [field]: numericValue };

    if (aspectRatioLocked) {
      if (field === "symbolWidth") {
        changes.symbolHeight = Math.round(numericValue / aspectRatio);
      } else if (field === "symbolHeight") {
        changes.symbolWidth = Math.round(numericValue * aspectRatio);
      }
    }

    onParamChange(changes);
  };

  // Обработчик переключения блокировки пропорций
  const toggleAspectRatioLock = () => {
    const newLockedState = !aspectRatioLocked;

    // Обновляем соотношение только при выключении блокировки
    if (!newLockedState) {
      setAspectRatio(parameters.symbolWidth / parameters.symbolHeight);
    }

    onParamChange({
      aspectRatioLocked: newLockedState,
    });
  };

  const renderColorRow = (field1, color1, field2, color2) => (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Фон"
            size="small"
            value={color1.toUpperCase()}
            onChange={(e) => onParamChange({ [field1]: e.target.value })}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color1}
            onChange={(newColor) => onParamChange({ [field1]: newColor })}
          />
          <TextField
            label="Символ"
            size="small"
            value={color2.toUpperCase()}
            onChange={(e) => onParamChange({ [field2]: e.target.value })}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color2}
            onChange={(newColor) => onParamChange({ [field2]: newColor })}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  const renderDualNumberRow = (
    field1,
    value1,
    label1,
    field2,
    value2,
    label2,
    unit,
    min1 = null,
    max1 = null,
    min2 = null,
    max2 = null,
    extraContent = null
  ) => (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label={`${label1}${unit ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value1}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min1 !== null) val = Math.max(min1, val);
              if (max1 !== null) val = Math.min(max1, val);
              handleParamChange(field1, val);
            }}
            inputProps={{ min: min1, max: max1 }}
            sx={{ flex: 1 }}
          />
          {extraContent}
          <TextField
            label={`${label2}${unit ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value2}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min2 !== null) val = Math.max(min2, val);
              if (max2 !== null) val = Math.min(max2, val);
              handleParamChange(field2, val);
            }}
            inputProps={{ min: min2, max: max2 }}
            sx={{ flex: 1 }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper elevation={2} sx={{ pt: 0, pb: 3 }}>
      <Table sx={{ "& td": { borderBottom: 0, pb: 0 } }}>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1">Цвета</Typography>
            </TableCell>
          </TableRow>

          {renderColorRow(
            "backgroundColor",
            parameters.backgroundColor,
            "symbolColor",
            parameters.symbolColor
          )}

          <TableRow>
            <TableCell>
              <Typography variant="body1">Поле</Typography>
            </TableCell>
          </TableRow>

          {renderDualNumberRow(
            "rows",
            parameters.rows,
            "Кол-во строк",
            "columns",
            parameters.columns,
            "Кол-во столбцов",
            "шт",
            1,
            9,
            1,
            9
          )}

          {renderDualNumberRow(
            "horizontalPadding",
            parameters.horizontalPadding,
            "Горизонт. отступ",
            "verticalPadding",
            parameters.verticalPadding,
            "Верт. отступ",
            "пикс",
            0,
            null,
            0,
            null
          )}

          <TableRow sx={{ "& td": { borderBottom: 0, paddingBottom: 0 } }}>
            <TableCell>
              <Typography variant="body1">Стимул</Typography>
            </TableCell>
          </TableRow>

          <TableRow sx={{ "& td": { borderBottom: 0 } }}>
            <TableCell>
              <Stack direction="row" spacing={2}>
                <AsciiSymbolSelect
                  value={parameters.symbolType}
                  onChange={(newSymbol) =>
                    onParamChange({ symbolType: newSymbol })
                  }
                  fontFamily={parameters.symbolFont}
                />
                <FontSelect
                  value={parameters.symbolFont}
                  onChange={(newFont) => onParamChange({ symbolFont: newFont })}
                />
              </Stack>
            </TableCell>
          </TableRow>

          {renderDualNumberRow(
            "symbolWidth",
            parameters.symbolWidth,
            "Ширина",
            "symbolHeight",
            parameters.symbolHeight,
            "Высота",
            "пикс",
            1,
            null,
            1,
            null,
            <IconButton
              onClick={toggleAspectRatioLock}
              color={aspectRatioLocked ? "primary" : "default"}
              sx={{ ml: 1 }}
              size="medium"
            >
              <Tooltip
                title={
                  aspectRatioLocked
                    ? "Сохранять пропорции"
                    : "Не сохранять пропорции"
                }
                arrow
              >
                {aspectRatioLocked ? <Link /> : <LinkOff />}
              </Tooltip>
            </IconButton>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default EditableExperimentGeneralParams;
