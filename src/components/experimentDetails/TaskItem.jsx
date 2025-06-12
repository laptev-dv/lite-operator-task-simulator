import React from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";

export default function TaskItem({
  task,
  isActive,
  onClick,
}) {
  return (
    <ListItem
      sx={{
        px: 1,
        py: 0.5,
        borderLeft: isActive ? "3px solid" : "none",
        borderColor: "primary.main",
        backgroundColor: isActive ? "#1976d21f" : "transparent",
        "&:hover": {
          backgroundColor: "#1976d20f",
        },
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <ListItemText
        primary={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">
              {task.name}
            </Typography>
          </Stack>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {`${task.rows}×${task.columns}`}
          </Typography>
        }
        sx={{ my: 0 }}
      />
    </ListItem>
  );
}