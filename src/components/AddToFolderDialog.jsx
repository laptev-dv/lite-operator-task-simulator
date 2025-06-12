import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function AddToFolderDialog({
  open,
  onClose,
  experiments = [],
  selectedExperimentIds = [],
  loading = false,
  searchTerm = "",
  onSearchChange,
  onSave,
  folderId,
}) {
  const [localSelected, setLocalSelected] = useState([]);

  // Инициализируем и синхронизируем состояние при открытии диалога
  useEffect(() => {
    if (open) {
      setLocalSelected([...selectedExperimentIds]);
    }
  }, [open, selectedExperimentIds]);

  const handleToggle = (experimentId) => {
    setLocalSelected((prev) => {
      const currentIndex = prev.indexOf(experimentId);
      const newSelected = [...prev];

      if (currentIndex === -1) {
        newSelected.push(experimentId);
      } else {
        newSelected.splice(currentIndex, 1);
      }

      return newSelected;
    });
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  const handleSubmit = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Управление экспериментами в папке
          </Typography>
          <Button
            component={Link}
            to="/experiment/create"
            state={{ fromFolder: folderId }}
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{ ml: 2 }}
          >
            Создать эксперимент
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск..."
            value={searchTerm}
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : experiments.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? "Ничего не найдено" : "Нет доступных экспериментов"}
            </Typography>
          </Box>
        ) : (
          <List dense>
            {experiments.map((experiment) => (
              <React.Fragment key={experiment._id}>
                <ListItem
                  sx={{
                    bgcolor: localSelected.includes(experiment._id)
                      ? "action.selected"
                      : "background.paper",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={localSelected.includes(experiment._id)}
                    onChange={() => handleToggle(experiment._id)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": `checkbox-${experiment._id}`,
                    }}
                  />

                  <ListItemText
                    id={`checkbox-${experiment._id}`}
                    primary={experiment.name}
                    secondary={
                      <Stack direction='row' alignItems='center' spacing={1}>
                        <Chip
                          color={
                            experiment.mode === "adaptive"
                              ? "primary"
                              : "secondary"
                          }
                          sx={{ width: 8, height: 8}}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {experiment.mode === "adaptive"
                            ? "Адаптивный"
                            : "Жёсткий"}{" "}
                          •{" "}
                          {format(
                            new Date(experiment.createdAt),
                            "dd.MM.yyyy HH:mm",
                            {
                              locale: ru,
                            }
                          )}
                        </Typography>
                      </Stack>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Отменить
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddToFolderDialog;
