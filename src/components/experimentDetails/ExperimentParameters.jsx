import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import ExperimentPreview from "../shared/ExperimentPreview";
import TimeParameters from "../shared/TimeParameters";
import ExperimentGeneralParams from "../shared/ExperimentGeneralParams";
import SeriesSettings from "../shared/SeriesSettings";
import ExperimentTasks from "./ExperimentTasks";

function ExperimentParameters({ parameters }) {
  const [activeTaskId, setActiveTaskId] = useState(
    parameters.tasks[0]?.id || null
  );

  const handleTaskClick = (taskId) => {
    setActiveTaskId(taskId);
  };

  const activeTask =
    parameters.tasks.find((task) => task.id === activeTaskId) ||
    parameters.tasks[0];

  return (
    <>
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
            static
            parameters={{
              ...parameters,
              experimentName: parameters.name
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
                static
              />

              {/* Основные параметры эксперимента */}
              <ExperimentGeneralParams 
                static
                parameters={activeTask} 
                onParamChange={()=>{}}
              />
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
          <ExperimentPreview parameters={activeTask} />
        </Box>
      </Stack>
    </>
  );
}

export default ExperimentParameters;
