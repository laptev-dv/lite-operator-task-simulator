import React from "react";
import { Paper, Typography, Box, Stack, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import SessionResultsTable from "./SessionResultsTable";
import { Delete as DeleteIcon } from "@mui/icons-material";

const SessionInfo = ({ sessionData, extendedResults }) => {
  const theme = useTheme();

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
      {/* Шапка с информацией о папке */}
      <Box
        sx={{
          p: 2,
          pr: 3,
          backgroundColor: theme.palette.grey[100],
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="column">
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {format(new Date(sessionData.createdAt), "dd.MM.yyyy HH:mm", {
                locale: ru,
              })}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Информация о сессии
            </Typography>
          </Stack>

          <IconButton
            edge="end"
            size="medium"
            onClick={(e) => {}}
            sx={{
              aspectRatio: 1,
            }}
          >
            <DeleteIcon fontSize="medium" />
          </IconButton>
        </Stack>
      </Box>

      <SessionResultsTable results={extendedResults} />
    </Paper>
  );
};

export default SessionInfo;
