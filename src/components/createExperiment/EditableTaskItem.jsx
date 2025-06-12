import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function EditableTaskItem({
  task,
  onDelete,
  onCopy,
  isActive,
  onClick,
  isDeleteDisabled,
  onTaskNameChange,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [taskName, setTaskName] = useState(task.name);

  useEffect(() => {
    setTaskName(task.name);
  }, [task.name]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setTaskName(newName);
    onTaskNameChange(task.id, newName);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        px: 1,
        py: 1,
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
      <ListItemIcon
        sx={{ minWidth: 32, cursor: isDragging ? "grabbing" : "grab" }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon color="action" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} marginRight={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={taskName}
              onChange={handleNameChange}
              onClick={(e) => e.stopPropagation()}
            />
            <Stack direction="row" spacing={0}>
              <Tooltip title="Копировать задачу">
                <IconButton
                  color="primary"
                  sx={{ aspectRatio: 1 }}
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(task.id);
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  isDeleteDisabled
                    ? "Нельзя удалить последнюю задачу"
                    : "Удалить задачу"
                }
              >
                <Box
                  sx={{
                    height: 40,
                    width: 40,
                    display: "flex",
                    alignContent: "center",
                  }}
                >
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    sx={{
                      color: "error.main",
                      aspectRatio: 1,
                    }}
                    disabled={isDeleteDisabled}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Tooltip>
            </Stack>
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
