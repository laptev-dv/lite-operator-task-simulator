import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  List,
  Divider,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import ExperimentItem from "../components/ExperimentItem";
import FolderItem from "../components/FolderItem";
import CreateFolderDialog from "../components/CreateFolderDialog";
import { experimentApi } from "../api/experimentApi";
import { folderApi } from "../api/folderApi";

function LibraryPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [anchorEl, setAnchorEl] = useState(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const [folders, setFolders] = useState([]);

  // Загрузка данных при изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const response = await experimentApi.getAll({
            search: searchQuery,
            sortBy: sortBy
          });
          setExperiments(response.data);
        } else {
          const response = await folderApi.getAll({
            search: searchQuery,
            sortBy: sortBy
          });
          setFolders(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    // Задержка для избежания частых запросов при вводе текста
    const timerId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timerId);
  }, [activeTab, searchQuery, sortBy]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddClose = () => {
    setAnchorEl(null);
  };

  const handleAddItem = (type) => {
    handleAddClose();
    if (type === "папку") {
      setFolderDialogOpen(true);
    } else if (type === "эксперимент") {
      navigate("/experiment/create");
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleCreateFolder = async (name) => {
    try {
      setLoading(true);
      const response = await folderApi.create({ name });
      const newFolder = response.data;
      setFolders([...folders, newFolder]);
      navigate(`/folder/${newFolder.id}`);
    } catch (error) {
      console.error("Ошибка создания папки:", error);
    } finally {
      setLoading(false);
      setFolderDialogOpen(false);
    }
  };

  const currentItems = activeTab === 0 ? experiments : folders;
  const hasItems = currentItems.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Шапка с заголовком и управлением */}
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
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Библиотека
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                size="small"
                disabled={loading}
              >
                Добавить
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ p: 3 }}>
          {/* Вкладки и фильтры */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ mb: 2 }}
            >
              <Tab label="Эксперименты" disabled={loading} />
              <Tab label="Папки" disabled={loading} />
            </Tabs>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Сортировка"
                  disabled={loading}
                >
                  <MenuItem value="date">По дате</MenuItem>
                  <MenuItem value="name">По названию</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                fullWidth
                variant="outlined"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Stack>
          </Box>

          {/* Список элементов */}
          <Box>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <CircularProgress />
              </Box>
            ) : hasItems ? (
              <List disablePadding>
                {currentItems.map((item, index) => (
                  <Box key={item._id}>
                    <Link
                      to={`/${activeTab === 0 ? "experiment" : "folder"}/${
                        item._id
                      }`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {activeTab === 0 ? (
                        <ExperimentItem experiment={item} />
                      ) : (
                        <FolderItem folder={item} />
                      )}
                    </Link>
                    {index !== currentItems.length - 1 && (
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
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {searchQuery ? 'Ничего не найдено' : 'Нет доступных элементов'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Меню добавления */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAddClose}
      >
        <MenuItem 
          onClick={() => handleAddItem("эксперимент")} 
          disabled={loading}
        >
          Создать эксперимент
        </MenuItem>
        <MenuItem 
          onClick={() => handleAddItem("папку")} 
          disabled={loading}
        >
          Создать папку
        </MenuItem>
      </Menu>

      {/* Диалог создания папки */}
      <CreateFolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={handleCreateFolder}
        loading={loading}
      />
    </Container>
  );
}

export default LibraryPage;