import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import ExperimentPreview from "../shared/ExperimentPreview";
import TimeParameters from "./TimeParameters";
import FullscreenPreview from "./FullscreenPreview";
import ExperimentGeneralParams from "./ExperimentGeneralParams";
import SeriesSettings from "./SeriesSettings";
import ExperimentTasks from "./ExperimentTasks";

function ExperimentParameters({ parameters }) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(
    parameters.tasks[0]?._id || null
  );

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handleTaskClick = (taskId) => {
    setActiveTaskId(taskId);
  };

  const activeTask =
    parameters.tasks.find((task) => task._id === activeTaskId) ||
    parameters.tasks[0];

  return (
    <>
      <FullscreenPreview
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        parameters={activeTask}
      />

      <Stack direction="row" gap={2}>
        <Stack
          direction="column"
          gap={2}
          sx={{
            flex: 1,
            maxWidth: 900,
          }}
        >
          {/* Блок серии и режима работы */}
          <SeriesSettings
            parameters={{
              mode: parameters.mode,
              initialTaskNumber: parameters.initialTaskNumber,
              presentationsPerTask: parameters.presentationsPerTask,
              seriesTime: parameters.seriesTime,
              efficiencyMin: parameters.efficiencyMin,
              efficiencyMax: parameters.efficiencyMax,
            }}
          />

          <Box sx={{ display: "flex", gap: 2, pb: 10 }}>
            {/* Блок задач */}
            <Box
              sx={{
                flex: 3,
                minWidth: 240,
                position: "sticky",
                top: 16,
                height: "calc(100vh - 16px - 80px)",
              }}
            >
              <ExperimentTasks
                tasks={parameters.tasks}
                activeTaskId={activeTaskId}
                onTaskClick={handleTaskClick}
              />
            </Box>

            <Box
              sx={{
                flex: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 320,
              }}
            >
              {/* Временные параметры */}
              <TimeParameters
                parameters={{
                  stimulusTime: activeTask.stimulusTime,
                  responseTime: activeTask.responseTime,
                  pauseTime: activeTask.pauseTime,
                }}
              />

              {/* Основные параметры эксперимента */}
              <ExperimentGeneralParams parameters={activeTask} />
            </Box>
          </Box>
        </Stack>

        {/* Блок предпросмотра */}
        <Box
          sx={{
            flex: 1,
            position: "sticky",
            minWidth: 200,
            top: 16,
            height: "calc(100vh - 16px - 80px)",
          }}
        >
          <ExperimentPreview
            parameters={activeTask}
            onFullscreen={handleFullscreenOpen}
          />
        </Box>
      </Stack>
    </>
  );
}

export default ExperimentParameters;
