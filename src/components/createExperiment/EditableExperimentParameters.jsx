import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import EditableSeriesSettings from "./EditableSeriesSettings";
import EditableExperimentTasks from "./EditableExperimentTasks";
import EditableExperimentGeneralParams from "./EditableExperimentGeneralParams";
import ExperimentPreview from "../shared/ExperimentPreview";
import EditableTimeParameters from "./EditableTimeParameters";

function EditableExperimentParameters({
  tasks,
  onTasksChange,
  experiment,
  onExperimentChange,
}) {
  const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id || null);
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  const handleTaskClick = (taskId) => {
    setActiveTaskId(taskId);
  };

  const handleTaskParamChange = (updatedParams) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === activeTaskId) {
        return {
          ...task,
          ...updatedParams,
        };
      }
      return task;
    });

    onTasksChange(updatedTasks);
  };

  const handleExperimentParamChange = (field, value) => {
    const updatedExperiment = {
      ...experiment,
      [field]: value,
    };

    onExperimentChange(updatedExperiment);
  };

  const handleTaskNameChange = (taskId, newName) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          name: newName,
        };
      }
      return task;
    });

    onTasksChange(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);

    if (activeTaskId === id) {
      setActiveTaskId(updatedTasks[0]?.id || null);
    }

    onTasksChange(updatedTasks);
  };

  const handleCopyTask = (taskId) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      const taskToCopy = tasks[taskIndex];
      const newTask = {
        ...taskToCopy,
        id: Date.now().toString(),
        name: `${taskToCopy.name} (копия)`,
      };
      const updatedTasks = [
        ...tasks.slice(0, taskIndex + 1),
        newTask,
        ...tasks.slice(taskIndex + 1),
      ];
      setActiveTaskId(newTask.id);
      onTasksChange(updatedTasks);
    }
  };

  if (!activeTask) {
    return <Typography>Нет активных задач</Typography>;
  }

  return (
    <Stack direction="row" gap={2}>
      <Stack
        direction="column"
        gap={2}
        sx={{
          flex: 1,
          maxWidth: 800,
        }}
      >
        <EditableSeriesSettings
          parameters={experiment}
          onParamChange={handleExperimentParamChange}
          tasksCount={tasks.length}
        />

        <Box sx={{ display: "flex", gap: 2, pb: 10 }}>
          <Box
            sx={{
              flex: 2,
              minWidth: 240,
              position: "sticky",
              top: 16,
              height: "calc(100vh - 16px - 80px)",
            }}
          >
            <EditableExperimentTasks
              tasks={tasks}
              activeTaskId={activeTaskId}
              onTaskClick={handleTaskClick}
              onDeleteTask={handleDeleteTask}
              onCopyTask={handleCopyTask}
              onTaskNameChange={handleTaskNameChange}
              onTasksChange={(newTasks) => {
                onTasksChange(newTasks);
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 320,
              height: "100%",
            }}
          >
            <EditableTimeParameters
              parameters={{
                stimulusTime: activeTask.stimulusTime,
                responseTime: activeTask.responseTime,
                pauseTime: activeTask.pauseTime,
              }}
              onParamChange={handleTaskParamChange}
            />

            <EditableExperimentGeneralParams
              parameters={activeTask}
              onParamChange={handleTaskParamChange}
            />
          </Box>
        </Box>
      </Stack>
      <Box
        sx={{
          flex: 3,
          position: "sticky",
          maxWidth: 720,
          top: 16,
          height: "calc(100vh - 16px - 80px)",
        }}
      >
        <ExperimentPreview parameters={activeTask} />
      </Box>
    </Stack>
  );
}

export default EditableExperimentParameters;
