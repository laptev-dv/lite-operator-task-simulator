import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  Divider,
  useTheme,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import ExperimentItem from "../components/ExperimentItem";
import { experimentApi } from "../api/experimentApi";

function LibraryPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);

  // Загрузка данных при изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await experimentApi.getAll({
          search: searchQuery,
          sortBy: sortBy
        });
        setExperiments(response.data);
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
  }, [searchQuery, sortBy]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateExperiment = () => {
    navigate("/experiment/create");
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const hasItems = experiments.length > 0;

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
              Исследования
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateExperiment}
              disabled={loading}
            >
              эксперимент
            </Button>
          </Stack>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ p: 3 }}>
          {/* Фильтры */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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

          {/* Список экспериментов */}
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
                {experiments.map((experiment, index) => (
                  <Box key={experiment.id}>
                    <Link
                      to={`/experiment/${experiment.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ExperimentItem experiment={experiment} />
                    </Link>
                    {index !== experiments.length - 1 && (
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
                  {searchQuery ? 'Ничего не найдено' : 'Нет доступных экспериментов'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LibraryPage;