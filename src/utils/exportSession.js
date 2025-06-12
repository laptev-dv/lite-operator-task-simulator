import * as XLSX from 'xlsx';

export const formatExportDate = (dateString) => {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleString('ru-RU', options);
};

export const formatExportDuration = (ms) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
};

const buildReportSheet = (sessionData) => {
  const rows = [];

  // Шапка отчета
  rows.push(["Серия эксперимента"]);
  rows.push(["Дата", "", formatExportDate(sessionData.createdAt)]);
  rows.push(["Реальная длительность, мин", "", formatExportDuration(sessionData.totalSeriesTime)]);
  rows.push(["Режим", "", sessionData.experiment.mode === 'strict' ? 'Строгий' : 'Адаптивный']);
  rows.push(["Число задач", "", sessionData.results.length]);
  
  const totalPresentations = sessionData.results.reduce(
    (sum, task) => sum + task.presentations.length, 0
  );
  rows.push(["Число предъявлений стимула", "", totalPresentations]);

  if (sessionData.experiment.mode === 'adaptive') {
    rows.push(["Заданная длительность, мин", "", sessionData.experiment.seriesTime]);
    rows.push(["Границы оценки", "", 
      `нижняя – ${sessionData.experiment.efficiencyMin}; верхняя – ${sessionData.experiment.efficiencyMax}`]);
  }
  rows.push([], ["Параметры задач"]);

  // Параметры задач
  sessionData.results.forEach((taskResult, index) => {
    const task = taskResult.task;
    rows.push(["№ задачи", index + 1]);
    rows.push(["Название", task.name]);
    rows.push(["Размер матрицы (строки х столбцы)", `${task.rows}×${task.columns}`]);
    rows.push(["Цвет символа", task.symbolColor]);
    rows.push(["Цвет фона", task.backgroundColor]);
    rows.push(["Вид символа", task.symbolType]);
    rows.push(["Шрифт символа", task.symbolFont]);
    rows.push(["Размер символа, пикс.", `ширина - ${task.symbolWidth}`, `высота - ${task.symbolHeight}`]);
    rows.push(["Расстояние между символами, пикс.", 
      `гор - ${task.horizontalSpacing}`, `верт - ${task.verticalSpacing}`]);
    rows.push(["Время предъявления стимула, с", (task.stimulusTime / 1000).toFixed(2)]);
    rows.push(["Время ожидания ответа, с", (task.responseTime / 1000).toFixed(2)]);
    rows.push(["Время паузы, с", (task.pauseTime / 1000).toFixed(2)]);
    rows.push([]);
  });

  // Результаты серии
  rows.push([], ["Результаты серии"], [
    "№ п/п", "№ задачи", "Количество ответов", "", "", "", 
    "Среднее время ответа, с", "Оценка эффективности", 
    "Итоговая оценка", "Производительность", "Нагрузка"
  ], ["", "", "правильных", "ошибочных", "пропущенных"]);

  sessionData.results.forEach((taskResult, index) => {
    const { presentations, task } = taskResult;
    
    let correct = 0;
    let error = 0;
    let miss = 0;

    presentations.forEach(p => {
      if (!p.userAnswer) {
        miss++;
        return;
      }
      
      const isCorrect = p.userAnswer.row === p.correctAnswer.row && 
                        p.userAnswer.column === p.correctAnswer.column;
      
      if (isCorrect) {
        correct++;
      } else {
        error++;
      }
    });

    const avgTime = presentations.reduce((sum, p) => sum + p.responseTime, 0) / presentations.length;
    const successRate = correct / presentations.length;
    const performance = successRate * (1 - avgTime / 10000);
    const difficulty = (task.rows * task.columns) / (task.stimulusTime / 1000);

    rows.push([
      index + 1,
      index + 1,
      correct,
      error,
      miss,
      (avgTime / 1000).toFixed(2),
      successRate.toFixed(2),
      performance.toFixed(2),
      difficulty.toFixed(2)
    ]);
  });

  return rows;
};

const buildFullDataSheet = (sessionData) => {
  const rows = [];

  sessionData.results.forEach((taskResult, taskIndex) => {
    rows.push([`Задача ${taskIndex + 1}`], [
      "№", "X", "Y", "Введенный X", "Введенный Y", 
      "Время (c)", "Корректен", "Результат"
    ]);

    taskResult.presentations.forEach((pres, idx) => {
      const hasAnswer = !!pres.userAnswer;
      const isCorrect = hasAnswer 
        ? pres.userAnswer.row === pres.correctAnswer.row && 
          pres.userAnswer.column === pres.correctAnswer.column
        : false;

      rows.push([
        idx + 1,
        pres.correctAnswer.row,
        pres.correctAnswer.column,
        hasAnswer ? pres.userAnswer.row : "-",
        hasAnswer ? pres.userAnswer.column : "-",
        (pres.responseTime / 1000).toFixed(2),
        isCorrect ? 1 : 0,
        hasAnswer ? (isCorrect ? "+" : "-") : "пропуск"
      ]);
    });
    rows.push([]);
  });

  return rows;
};

export const exportSessionToXLSX = (sessionData) => {
  const workbook = XLSX.utils.book_new();
  
  // Лист "Отчет"
  const reportSheet = XLSX.utils.aoa_to_sheet(buildReportSheet(sessionData));
  XLSX.utils.book_append_sheet(workbook, reportSheet, "Отчет");

  // Лист "Полные данные"
  const fullDataSheet = XLSX.utils.aoa_to_sheet(buildFullDataSheet(sessionData));
  XLSX.utils.book_append_sheet(workbook, fullDataSheet, "Полные данные");

  XLSX.writeFile(workbook, `Сессия_${sessionData._id}_${Date.now()}.xlsx`);
};