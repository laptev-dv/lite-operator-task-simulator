import React from "react";
import { Stack, Typography, Chip } from "@mui/material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function ExperimentItem({ experiment }) {
  return (
    <Stack
      direction="row"
      justifyContent='space-between'
      alignItems='center'
      sx={{
        p: 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        transition: "background-color 0.2s ease",
      }}
    >
      <Stack direction="column">
        {/* Верхняя строка - статистика */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
           {experiment.sessionsCount} сессий • { format(new Date(experiment.createdAt), "dd.MM.yyyy HH:mm", {
            locale: ru,
          })}
        </Typography>

        {/* Основное название */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, pr: 6 }}>
          {experiment.name}
        </Typography>
      </Stack>
      {/* Чип режима работы */}
      <Chip
        label={experiment.mode === "adaptive" ? "Адаптивный" : "Жёсткий"}
        size="small"
        variant="outlined"
        sx={{
          borderColor: experiment.mode === "adaptive" ? "primary.main" : "secondary.main",
          color: experiment.mode === "adaptive" ? "primary.main" : "secondary.main",
        }}
      />
    </Stack>
  );
}

export default ExperimentItem;
