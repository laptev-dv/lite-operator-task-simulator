import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  List,
  Stack,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import FolderExperimentItem from "../components/FolderExperimentItem";
import AddToFolderDialog from "../components/AddToFolderDialog";
import EditFolderDialog from "../components/EditFolderDialog";
import { folderApi } from "../api/folderApi";
import { experimentApi } from "../api/experimentApi";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function FolderPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [folderLoading, setFolderLoading] = useState(true);
  const [experimentsLoading, setExperimentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [folder, setFolder] = useState(null);
  const [allExperiments, setAllExperiments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperiments, setSelectedExperiments] = useState([]);

  const openMenu = Boolean(anchorEl);

  // Функция для загрузки данных папки
  const loadFolderData = async () => {
    try {
      setFolderLoading(true);
      const response = await folderApi.getById(id);
      setFolder(response.data);
      setSelectedExperiments(response.data.experiments.map(item => item._id) || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFolderLoading(false);
      setLoading(false);
    }
  };

  // Загрузка данных папки
  useEffect(() => {
    loadFolderData();
  }, [id]);

  // Загрузка всех экспериментов при открытии диалога
  useEffect(() => {
    const loadExperiments = async () => {
      if (!dialogOpen) return;
      
      try {
        setExperimentsLoading(true);
        const response = await experimentApi.getAll({ search: searchTerm });
        setAllExperiments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setExperimentsLoading(false);
      }
    };

    loadExperiments();
  }, [dialogOpen, searchTerm]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await folderApi.delete(id);
      navigate('/library');
    } catch (err) {
      setError(err.message);
    } finally {
      handleMenuClose();
    }
  };

  const handleAddClick = () => {
    setDialogOpen(true);
    setSearchTerm('');
  };

  const handleSaveFolder = async (updatedFolder) => {
    try {
      await folderApi.update(id, updatedFolder);
      await loadFolderData(); // Перезагружаем данные после обновления
      setEditDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExperiments = async (selectedExperimentIds) => {
    try {
      await folderApi.setExperiments(id, selectedExperimentIds);
      await loadFolderData(); // Перезагружаем данные после обновления
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveExperiment = async (experimentId) => {
    try {
      const newExperimentIds = folder.experiments
        .filter(exp => exp._id !== experimentId)
        .map(exp => exp._id);
      
      await folderApi.setExperiments(folder._id, newExperimentIds);
      await loadFolderData(); // Перезагружаем данные после удаления
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  if (!folder && loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Загрузка папки...
            </Typography>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Шапка с информацией о папке */}
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems='center'>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(folder.createdAt), "dd.MM.yyyy HH:mm", {
                              locale: ru,
                            })}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {folder.name}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                size="small"
              >
                Добавить \ Изменить
              </Button>

              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Меню действий */}
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem
            onClick={handleEdit}
            sx={{ color: theme.palette.text.primary }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Редактировать</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Удалить</ListItemText>
          </MenuItem>
        </Menu>

        {/* Список экспериментов */}
        <Box sx={{ p: 2 }}>
          {folderLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : folder.experiments.length > 0 ? (
            <List disablePadding>
              {folder.experiments.map((experiment, index) => (
                <Box key={experiment._id}>
                  <Link
                    to={`/experiment/${experiment._id}`}
                    state={{ fromFolder: folder._id }}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <FolderExperimentItem
                      experiment={experiment}
                      onRemove={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveExperiment(experiment._id);
                      }}
                    />
                  </Link>
                  {index !== folder.experiments.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                </Box>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Папка пуста
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Диалог добавления экспериментов */}
      <AddToFolderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        experiments={allExperiments}
        selectedExperimentIds={selectedExperiments}
        loading={experimentsLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSave={handleUpdateExperiments}
        folderId={folder._id}
      />

      {/* Диалог редактирования папки */}
      <EditFolderDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        folder={folder}
        onSave={handleSaveFolder}
      />
    </Container>
  );
}

export default FolderPage;