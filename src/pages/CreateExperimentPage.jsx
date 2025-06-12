import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Container,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import EditableExperimentParameters from "../components/createExperiment/EditableExperimentParameters";
import { useNavigate, useLocation } from "react-router-dom";
import { experimentApi } from "../api/experimentApi";
import ExperimentBreadcrumbs from "../components/experimentDetails/ExperimentBreadCrumbs";

function CreateExperimentPage() {
  const location = useLocation();
  const folderId = location.state?.fromFolder;
  const copiedExperiment = location.state?.copiedExperiment;

  const navigate = useNavigate();

  const [experiment, setExperiment] = useState({
    experimentName: "",
    mode: "adaptive",
    presentationsPerTask: 20,
    seriesTime: 30,
    efficiencyMin: 50,
    efficiencyMax: 80,
    initialTaskNumber: 1,
  });

  const [tasks, setTasks] = useState([
    {
      id: "1",
      name: "Задача 2×2",
      rows: 2,
      columns: 2,
      backgroundColor: "#ffffff",
      symbolType: "X",
      symbolFont: "Arial",
      symbolWidth: 30,
      symbolHeight: 30,
      horizontalPadding: 5,
      verticalPadding: 5,
      symbolColor: "#000000",
      stimulusTime: 500,
      responseTime: 1000,
      pauseTime: 300,
      aspectRatioLocked: true,
    },
  ]);

  useEffect(() => {
    if (copiedExperiment) {
      // Заполняем данные из копируемого эксперимента
      setExperiment({
        experimentName: `${copiedExperiment.name} (копия)`,
        mode: copiedExperiment.mode,
        presentationsPerTask: copiedExperiment.presentationsPerTask,
        seriesTime: copiedExperiment.seriesTime,
        efficiencyMin: copiedExperiment.efficiencyMin,
        efficiencyMax: copiedExperiment.efficiencyMax,
        initialTaskNumber: copiedExperiment.initialTaskNumber,
      });

      // Преобразуем задачи для формы создания
      const convertedTasks = copiedExperiment.tasks.map((task, index) => ({
        id: String(index + 1),
        name: task.name,
        rows: task.rows,
        columns: task.columns,
        backgroundColor: task.backgroundColor,
        symbolType: task.symbolType,
        symbolFont: task.symbolFont,
        symbolWidth: task.symbolWidth,
        symbolHeight: task.symbolHeight,
        horizontalPadding: task.horizontalSpacing,
        verticalPadding: task.verticalSpacing,
        symbolColor: task.symbolColor,
        stimulusTime: task.stimulusTime,
        responseTime: task.responseTime,
        pauseTime: task.pauseTime,
        aspectRatioLocked: true,
      }));

      setTasks(convertedTasks);
    }
  }, [copiedExperiment]);

  const handleSaveExperiment = async () => {
    try {
      if (tasks.length === 0) {
        alert("Добавьте хотя бы одну задачу");
        return;
      }

      // Подготавливаем данные для отправки
      const experimentData = {
        name:
          experiment.experimentName.length > 0
            ? experiment.experimentName
            : `Новый эксперимент`,
        mode: experiment.mode,
        presentationsPerTask: experiment.presentationsPerTask,
        tasks: tasks.map((task) => ({
          name: task.name,
          rows: task.rows,
          columns: task.columns,
          backgroundColor: task.backgroundColor,
          symbolColor: task.symbolColor,
          symbolType: task.symbolType,
          symbolFont: task.symbolFont,
          symbolHeight: task.symbolHeight,
          symbolWidth: task.symbolWidth,
          verticalSpacing: task.verticalPadding,
          horizontalSpacing: task.horizontalPadding,
          stimulusTime: task.stimulusTime,
          responseTime: task.responseTime,
          pauseTime: task.pauseTime,
        })),
      };

      // Добавляем параметры для adaptive режима
      if (experiment.mode === "adaptive") {
        experimentData.efficiencyMin = experiment.efficiencyMin;
        experimentData.efficiencyMax = experiment.efficiencyMax;
        experimentData.initialTaskNumber = experiment.initialTaskNumber;
        experimentData.seriesTime = experiment.seriesTime;
      }

      // Отправляем запрос на сервер
      const response = await experimentApi.create(experimentData);

      if (response.data?._id) {
        navigate(`/experiment/${response.data._id}`);
      } else {
        throw new Error("Не удалось получить ID созданного эксперимента");
      }
    } catch (error) {
      console.error("Ошибка при создании эксперимента:", error);
      alert(error.response?.data?.message || "Не удалось создать эксперимент");
    }
  };

  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  const handleExperimentChange = (updatedExperiment) => {
    setExperiment(updatedExperiment);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        p: 3,
        pb: 0,
      }}
    >
      <ExperimentBreadcrumbs folderId={folderId} lastName="Новый эксперимент" />

      <TextField
        fullWidth
        label="Название эксперимента"
        variant="outlined"
        value={experiment.experimentName}
        onChange={(event) =>
          setExperiment({
            ...experiment,
            experimentName: event.target.value,
          })
        }
        sx={{
          mb: 2,
        }}
        inputProps={{
          style: {
            fontSize: "1.2rem",
            padding: "12px 14px",
          },
        }}
      />

      <EditableExperimentParameters
        tasks={tasks}
        onTasksChange={handleTasksChange}
        experiment={experiment}
        onExperimentChange={handleExperimentChange}
      />

      {/* Фиксированная панель внизу */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar>
          {/* Отображение текущего режима слева */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Текущий режим:
            </Typography>
            <Chip
              label={experiment.mode === "adaptive" ? "Адаптивный" : "Жесткий"}
              color={experiment.mode === "adaptive" ? "primary" : "secondary"}
              variant="outlined"
            />
          </Box>

          {/* Кнопка сохранения справа */}
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveExperiment}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                my: 1,
              }}
            >
              Сохранить эксперимент
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Container>
  );
}

export default CreateExperimentPage;