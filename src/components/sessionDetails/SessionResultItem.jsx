import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SessionResultItem = ({ task, isActive, onClick, stats }) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isActive}
        onClick={onClick}
        sx={{
          borderRadius: 1,
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
          },
        }}
      >
        <ListItemText
          primary={task.name}
          secondary={`${task.rows}×${task.columns}`}
        />
        
        {stats && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={`${Math.round(stats.efficiency * 100)}%`}
              size="small"
              color={stats.efficiency >= 0.7 ? "success" : stats.efficiency >= 0.4 ? "warning" : "error"}
            />
            <Typography variant="caption" color="text.secondary">
              {stats.success}/{stats.error}/{stats.miss}
            </Typography>
          </Stack>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default SessionResultItem;