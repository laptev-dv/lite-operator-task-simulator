import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Box,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskItem({
  task,
  onDelete,
  onCopy,
  isActive,
  onClick,
  isDeleteDisabled,
  static: isStatic = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isStatic });

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
      {/* Иконка перетаскивания скрывается в статическом режиме */}
      {!isStatic && (
        <ListItemIcon
          sx={{ minWidth: 32, cursor: isDragging ? "grabbing" : "grab" }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon color="action" />
        </ListItemIcon>
      )}

      <ListItemText
        primary={
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
                bgcolor: task.backgroundColor,
                color: task.symbolColor,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {task.symbolType}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {`${task.rows}×${task.columns}`}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{
                  display: 'block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.symbolFont}
              </Typography>
            </Box>
          </Stack>
        }
        sx={{ my: 0 }}
      />

      {/* Кнопки действий скрываются в статическом режиме */}
      {!isStatic && (
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Tooltip title="Копировать задачу">
            <IconButton
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
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                disabled={isDeleteDisabled}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Tooltip>
        </Stack>
      )}
    </ListItem>
  );
}