import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import TimeParameters from "../experimentDetails/TimeParameters";
import ExperimentGeneralParams from "../experimentDetails/ExperimentGeneralParams";
import SeriesSettings from "../experimentDetails/SeriesSettings";
import SessionResults from "./SessionResults";
import SessionDetailsPreview from "./SessionDetailsPreview";

function SessionParameters({ sessionData }) {
  const { experiment, results } = sessionData;

  const [activeResultId, setActiveResultId] = useState(results[0]?._id);

  const handleTaskClick = (resultId) => {
    setActiveResultId(resultId);
  };

  const activeResult =
    results.find((result) => result._id === activeResultId) || results[0];

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
            parameters={{
              mode: experiment.mode,
              initialTaskNumber: experiment.initialTaskNumber,
              presentationsPerTask: experiment.presentationsPerTask,
              seriesTime: experiment.seriesTime,
              efficiencyMin: experiment.efficiencyMin,
              efficiencyMax: experiment.efficiencyMax,
            }}
          />

          <Box sx={{ display: "flex", gap: 2, pb: 10 }}>
            {/* Блок результатов */}
            <Box
              sx={{
                flex: 3,
                minWidth: 240,
                position: "sticky",
                top: 16,
                height: "calc(100vh - 16px - 80px)",
              }}
            >
              <SessionResults
                results={results}
                activeResultId={activeResultId}
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
                  stimulusTime: activeResult.task.stimulusTime,
                  responseTime: activeResult.task.responseTime,
                  pauseTime: activeResult.task.pauseTime,
                }}
              />

              {/* Основные параметры эксперимента */}
              <ExperimentGeneralParams
                parameters={{
                  ...activeResult.task,
                  ...activeResult,
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* Блок предпросмотра */}
        <Box
          sx={{
            flex: 1,
            position: "sticky",
            top: 16,
            height: "calc(100vh - 16px - 80px)",
          }}
        >
          <SessionDetailsPreview parameters={activeResult} />
        </Box>
      </Stack>
    </>
  );
}

export default SessionParameters;
