import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import FullscreenStimulus from "../components/FullscreenStimulus";
import ExperimentProgressBar from "../components/ExperimentProgressBar";
import UserInputDisplay from "../components/UserInputDisplay";
import RunExperimentKeyboard from "../components/RunExperimentKeyboard";
import { styled, keyframes } from "@mui/system";
import { sessionApi } from "../api/sessionApi";

const TICK_INTERVAL = 100;

// Анимация виньетки
const vignettePulse = keyframes`
  0% { opacity: 0; }
  20% { opacity: 0.7; }
  100% { opacity: 0; }
`;

// Стилизованный компонент для виньетки
const VignetteOverlay = styled(Box)(({ color }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  zIndex: 1000,
  boxShadow: `inset 0 0 50px 20px ${color}`,
  animation: `${vignettePulse} 0.8s ease-out`,
  opacity: 0,
}));

const ExperimentRunPage = () => {
  const CACHE_KEY = "google-fonts-cache";
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 часа

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const experiment = location.state?.experiment;

  const seriesTime = useMemo(
    () => (experiment?.seriesTime || 1) * 60 * 1000,
    [experiment]
  );

  // Состояния эксперимента
  const [isCompleting, setIsCompleting] = useState(false);
  const [currentResponseTime, setCurrentResponseTime] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(
    experiment?.initialTaskNumber - 1 || 0
  );
  const [presentationCount, setPresentationCount] = useState(0);
  const [seriesTimeLeft, setSeriesTimeLeft] = useState(seriesTime);
  const [shouldCompleteAfterCurrentTask, setShouldCompleteAfterCurrentTask] =
    useState(false);

  // Счетчики и статистика
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [presentationResults, setPresentationResults] = useState([]);
  const [taskResults, setTaskResults] = useState([]);

  // Состояния для анимации виньетки
  const [vignetteColor, setVignetteColor] = useState(null);
  const [vignetteKey, setVignetteKey] = useState(0);

  const tasks = useMemo(() => experiment?.tasks || [], [experiment]);
  const mode = useMemo(() => experiment?.mode || "strict", [experiment]);
  const presentationsPerTask = useMemo(
    () => experiment?.presentationsPerTask,
    [experiment]
  );
  const efficiencyMin = useMemo(() => experiment?.efficiencyMin, [experiment]);
  const efficiencyMax = useMemo(() => experiment?.efficiencyMax, [experiment]);
  const currentTask = useMemo(
    () => tasks[activeTaskIndex] || {},
    [tasks, activeTaskIndex]
  );

  const [hiddenPosition, setHiddenPosition] = useState({
    row: Math.floor(Math.random() * currentTask.rows) + 1,
    col: Math.floor(Math.random() * currentTask.columns) + 1,
  });

  const [currentPhase, setCurrentPhase] = useState("stimulus");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(currentTask.stimulusTime);
  const [timerIsRunning, setTimerIsRunning] = useState(true);

  const platform = useMemo(() => getPlatform(), []);
  const isMobileLandscape = useMediaQuery("(orientation: landscape)");
  const showKeyboard = isMobileLandscape && platform === 'Mobile';
  
  const preloadFonts = (fontFamilies) => {
    fontFamilies.forEach((fontFamily) => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        / /g,
        "+"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedData = cached ? JSON.parse(cached) : null;

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          preloadFonts(cachedData.fonts);
          return;
        }

        const fonts = experiment.tasks.map((task) => task.symbolFont);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            fonts: fonts,
            timestamp: Date.now(),
          })
        );

        preloadFonts(fonts);
      } catch (error) {
        console.error("Error fetching fonts:", error);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedFonts = JSON.parse(cached).fonts;
          preloadFonts(cachedFonts);
        }
      }
    };

    fetchFonts();
  }, [CACHE_EXPIRY, experiment.tasks]);

  // Эффект для обработки изменений счетчиков
  useEffect(() => {
    if (errorCount > 0) {
      triggerVignette("#ff0000");
    }
  }, [errorCount]);

  useEffect(() => {
    if (missCount > 0) {
      triggerVignette("#0000ff");
    }
  }, [missCount]);

  useEffect(() => {
    if (successCount > 0) {
      triggerVignette("#00ff00");
    }
  }, [successCount]);

  // Функция для запуска анимации виньетки
  const triggerVignette = (color) => {
    setVignetteColor(color);
    setVignetteKey((prevKey) => prevKey + 1);
  };

  // Сохранение статистики по выполнению задачи
  const saveTaskExecution = useCallback(() => {
    const taskExecution = {
      taskId: currentTask._id,
      presentations: [...presentationResults],
    };

    setTaskResults((prev) => [...prev, taskExecution]);
    setPresentationResults([]);
    return taskExecution;
  }, [currentTask, presentationResults]);

  // Завершение эксперимента
  const completeExperiment = useCallback(async () => {
    setIsCompleting(true);
    setTimerIsRunning(false);

    try {
      const lastExecution = saveTaskExecution();
      const finalStats = [...taskResults, lastExecution];

      // Подготовка данных для сохранения
      const sessionData = {
        experimentId: id,
        results: finalStats,
      };

      // Отправка данных на сервер
      const response = await sessionApi.create(sessionData);

      if (response.data?._id) {
        navigate(`/session/${response.data._id}`);
      } else {
        throw new Error("Не удалось получить ID созданной сессии");
      }
    } catch (error) {
      console.error("Ошибка сохранения сессии:", error);
      navigate(`/experiment/${id}`);
    }
  }, [id, taskResults, navigate, saveTaskExecution]);

  // Определение следующей задачи (для адаптивного режима)
  const getNextTaskIndex = useCallback(
    (currentIndex, efficiency) => {
      if (shouldCompleteAfterCurrentTask) {
        completeExperiment();
        return currentIndex; // Вернем текущий индекс, так как эксперимент завершается
      }

      if (mode === "strict") {
        return (currentIndex + 1) % tasks.length;
      }

      if (efficiency < efficiencyMin) {
        return Math.max(0, currentIndex - 1);
      } else if (efficiency > efficiencyMax) {
        return Math.min(tasks.length - 1, currentIndex + 1);
      }
      return currentIndex;
    },
    [
      mode,
      tasks.length,
      efficiencyMin,
      efficiencyMax,
      shouldCompleteAfterCurrentTask,
      completeExperiment,
    ]
  );

  // Проверка ответа пользователя
  const checkAnswer = useCallback(() => {
    const [row, col] = userInput;

    let userAnswer = null;
    if (row && col) {
      userAnswer = { row: row, column: col };
    }

    const isCorrect =
      row === hiddenPosition.row && col === hiddenPosition.col;

    if (userInput.length < 2) {
      setMissCount((prev) => prev + 1);
    } else if (isCorrect) {
      setSuccessCount((prev) => prev + 1);
    } else {
      setErrorCount((prev) => prev + 1);
    }

    const presentationResult = {
      responseTime:
        currentResponseTime ||
        currentTask.responseTime + currentTask.stimulusTime,
      correctAnswer: {
        row: hiddenPosition.row,
        column: hiddenPosition.col,
      },
      userAnswer: userAnswer,
    };

    setPresentationResults((prev) => [...prev, presentationResult]);
  }, [hiddenPosition, userInput, currentResponseTime, currentTask]);

  // Обработчик ввода с клавиатуры
  const handleKeyDown = useCallback(
    (e) => {
      if (currentPhase === "pause" || userInput.length >= 2) return;
      if (!/^[1-9]$/.test(e.key)) return;

      const newInput = [...userInput, parseInt(e.key, 10)];
      setUserInput(newInput);

      if (newInput.length === 2) {
        let responseTime = currentTask.stimulusTime;
        if (currentPhase === "stimulus") {
          responseTime -= phaseTimeLeft;
        } else if (currentPhase === "response") {
          responseTime += currentTask.responseTime - phaseTimeLeft;
        }
        
        setCurrentResponseTime(responseTime);
        setCurrentPhase("response");
        setPhaseTimeLeft(0);
      }
    },
    [currentPhase, userInput, currentTask, phaseTimeLeft]
  );

  // Переход к следующей фазе
  const goToNextPhase = useCallback(() => {
    if (currentPhase === "stimulus") {
      setCurrentPhase("response");
      setPhaseTimeLeft(currentTask.responseTime);
    } else if (currentPhase === "response") {
      checkAnswer();
      setCurrentPhase("pause");
      setPhaseTimeLeft(currentTask.pauseTime);
    } else if (currentPhase === "pause") {
      const newCount = presentationCount + 1;
      if (newCount >= presentationsPerTask) {
        const stats = saveTaskExecution();

        if (mode === "strict") {
          const nextIndex = (activeTaskIndex + 1) % tasks.length;
          if (nextIndex === 0) {
            completeExperiment();
            return;
          }
          setActiveTaskIndex(nextIndex);
        } else {
          const nextIndex = getNextTaskIndex(activeTaskIndex, stats.efficiency);
          if (nextIndex !== activeTaskIndex) {
            setActiveTaskIndex(nextIndex);
          }
        }

        setPresentationCount(0);
        setSuccessCount(0);
        setErrorCount(0);
        setMissCount(0);
        setPresentationResults([]);
      } else {
        setPresentationCount(newCount);
      }
            
      setHiddenPosition({
        row: Math.floor(Math.random() * currentTask.rows) + 1,
        col: Math.floor(Math.random() * currentTask.columns) + 1,
      });  

      setCurrentResponseTime(null);
      setCurrentPhase("stimulus");
      setPhaseTimeLeft(currentTask.stimulusTime);
      setUserInput([]);
    }
    setTimerIsRunning(true);
  }, [
    currentPhase,
    currentTask,
    presentationsPerTask,
    activeTaskIndex,
    tasks.length,
    mode,
    presentationCount,
    saveTaskExecution,
    getNextTaskIndex,
    completeExperiment,
    checkAnswer,
  ]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Таймер фаз
  useEffect(() => {
    if (!timerIsRunning) return;

    const timer = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        return prev - TICK_INTERVAL;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [currentPhase, currentTask, timerIsRunning]);

  useEffect(() => {
    if (isCompleting) return;

    if (phaseTimeLeft <= 0) {
      setTimerIsRunning(false);
      goToNextPhase();
    }
  }, [phaseTimeLeft, isCompleting, goToNextPhase]);

  // Таймер общего времени (для адаптивного режима)
  useEffect(() => {
    if (mode !== "adaptive") return;

    const timer = setInterval(() => {
      setSeriesTimeLeft((prev) => {
        const newTime = prev - TICK_INTERVAL;
        if (newTime <= 0) {
          setShouldCompleteAfterCurrentTask(true);
          return 0;
        }
        return newTime;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [mode]);

  // Прерывание эксперимента
  const handleInterrupt = useCallback(() => {
    completeExperiment();
  }, [completeExperiment]);

  return (
    <Box
      sx={{
        backgroundColor: currentTask.backgroundColor,
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Виньетка для визуальной обратной связи */}
      {vignetteColor && (
        <VignetteOverlay
          color={vignetteColor}
          key={vignetteKey}
          onAnimationEnd={() => setVignetteColor(null)}
        />
      )}

      {showKeyboard && (
        <RunExperimentKeyboard onKeyPress={handleKeyDown} />
      )}

      <ExperimentProgressBar
        currentPhase={currentPhase}
        phaseTimeLeft={phaseTimeLeft}
        currentTask={currentTask}
        presentationCount={presentationCount}
        presentationsPerTask={presentationsPerTask}
        mode={mode}
        seriesTimeLeft={seriesTimeLeft}
        onInterrupt={handleInterrupt}
      />

      <FullscreenStimulus
        parameters={currentTask}
        hiddenPosition={currentPhase === "stimulus" ? hiddenPosition : null}
      />

      <UserInputDisplay userInput={userInput} />
    </Box>
  );
};

const getPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'Mobile';
  }
  
  if (/android/i.test(userAgent)) {
    return 'Mobile';
  }
  
  return 'Desktop';
};

export default ExperimentRunPage;