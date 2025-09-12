import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SessionInfo from "../components/sessionDetails/SessionInfo";
import SessionActionsBar from "../components/sessionDetails/SessionActionsBar";
import { sessionApi } from "../api/sessionApi";
import SessionParameters from "../components/sessionDetails/SessionParameters";
import ExperimentParameters from "../components/experimentDetails/ExperimentParameters";
import { exportSessionToXLSX } from "../utils/exportSession";

function ExperimentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExportPDF = async () => {
    try {
      setActionLoading(true);
      const response = await sessionApi.exportToPDF(id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Сессия_${sessionData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportXLSX = () => {
    exportSessionToXLSX(sessionData);
  };

  const handleDuplicateExperiment = async (newName) => {
    navigate("/experiment/create", {
      state: {
        copiedExperiment: sessionData.experiment
      },
    });
  };

  const handleRepeatExperiment = () => {
    navigate(`/experiment/${sessionData.experiment.id}/run`, {
      state: { experiment: sessionData.experiment }
    });
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const response = await sessionApi.getById(id);
        setSessionData(response.data);

        const fontFamilies = response.data.results.map(
          (result) => result.task.symbolFont
        );
        preloadFonts(fontFamilies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const preloadFonts = (fontFamilies) => {
    fontFamilies.forEach((fontFamily) => {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        / /g,
        "+"
      )}&display=swap`;
      const existingLinks = Array.from(
        document.head.querySelectorAll('link[rel="stylesheet"]')
      );

      if (!existingLinks.some((link) => link.href === fontUrl)) {
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });
  };

  const calculateExtendedMetrics = (results) => {
    if (!results || results.length === 0) return [];

    return results.map((task) => {
      const totalPresentations = task.presentations.length;
      const successRate = task.successCount / totalPresentations;
      const errorRate = task.errorCount / totalPresentations;
      const missRate = task.missCount / totalPresentations;

      const performanceScore = successRate * (1 - task.avgResponseTime / 10000);
      const taskDifficulty = (task.rows * task.columns) / task.stimulusTime;

      return {
        ...task,
        successRate: Number((successRate * 100).toFixed(1)),
        errorRate: Number((errorRate * 100).toFixed(1)),
        missRate: Number((missRate * 100).toFixed(1)),
        performanceScore: Number(performanceScore.toFixed(2)),
        taskDifficulty: Number(taskDifficulty.toFixed(2)),
        parameters: {
          rows: task.rows,
          columns: task.columns,
          stimulusTime: task.stimulusTime,
          responseTime: task.responseTime,
          pauseTime: task.pauseTime,
        },
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Назад</Button>
      </Box>
    );
  }

  if (!sessionData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Данные сессии не найдены</Alert>
        <Button onClick={() => navigate(-1)}>Назад</Button>
      </Box>
    );
  }

  const extendedResults = calculateExtendedMetrics(sessionData.results || []);
  const overallStats = extendedResults.reduce(
    (acc, task) => {
      acc.totalPresentations += task.presentations?.length || 0;
      acc.totalSuccess += task.successCount || 0;
      acc.totalErrors += task.errorCount || 0;
      acc.totalMisses += task.missCount || 0;
      acc.totalResponseTime +=
        (task.avgResponseTime || 0) * (task.presentations?.length || 0);
      return acc;
    },
    {
      totalPresentations: 0,
      totalSuccess: 0,
      totalErrors: 0,
      totalMisses: 0,
      totalResponseTime: 0,
    }
  );

  const overallEfficiency =
    overallStats.totalPresentations > 0
      ? (overallStats.totalSuccess / overallStats.totalPresentations) * 100
      : 0;
  const avgResponseTime =
    overallStats.totalPresentations > 0
      ? overallStats.totalResponseTime / overallStats.totalPresentations
      : 0;

  return (
    <Container
      maxWidth="xl"
      sx={{
        p: 3,
        pb: 0,
      }}
    >
      <SessionInfo
        sessionData={{
          ...sessionData,
          date: new Date(sessionData.date).toLocaleString(),
          duration: formatDuration(sessionData.duration),
          overallEfficiency: Number(overallEfficiency.toFixed(1)),
          avgResponseTime: Number(avgResponseTime.toFixed(0)),
          tasksCount: sessionData.results?.length || 0,
          totalPresentations: overallStats.totalPresentations,
          totalSuccess: overallStats.totalSuccess,
          totalErrors: overallStats.totalErrors,
          totalMisses: overallStats.totalMisses,
        }}
        extendedResults={extendedResults}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Настройки" />
          <Tab label="Результаты эксперимента" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <ExperimentParameters parameters={sessionData.experiment} />
      )}
      
      {activeTab === 1 && (
        <SessionParameters sessionData={sessionData} />
      )}

      <SessionActionsBar
        sessionData={sessionData}
        onExportPDF={handleExportPDF}
        onExportXLSX={handleExportXLSX}
        onRepeatExperiment={handleRepeatExperiment}
        onDuplicateExperiment={handleDuplicateExperiment}
        loading={actionLoading}
      />
    </Container>
  );
}

function formatDuration(milliseconds) {
  if (!milliseconds) return "0:00";
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default ExperimentDetailsPage;