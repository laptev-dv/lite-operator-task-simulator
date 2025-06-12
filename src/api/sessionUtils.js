// sessionUtils.js
export const calculateDetailedStats = (results) => {
  return results.map(taskResult => {
    if (!taskResult.task || !taskResult.presentations) {
      return {
        ...taskResult,
        successCount: 0,
        errorCount: 0,
        missCount: 0,
        totalResponseTime: 0,
        finalScore: 0,
        entropy: 0,
        performance: 0,
        workload: 0,
        avgResponseTime: 0,
        efficiency: 0,
        totalDuration: 0
      };
    }

    const stats = {
      id: taskResult.id || taskResult._id,
      task: taskResult.task,
      presentations: taskResult.presentations,
      successCount: 0,
      errorCount: 0,
      missCount: 0,
      totalResponseTime: 0
    };

    taskResult.presentations.forEach(presentation => {
      if (presentation.userAnswer?.row !== undefined && presentation.userAnswer?.column !== undefined) {
        const isCorrect = 
          presentation.userAnswer.row === presentation.correctAnswer.row &&
          presentation.userAnswer.column === presentation.correctAnswer.column;
        
        if (isCorrect) {
          stats.successCount++;
        } else {
          stats.errorCount++;
        }

        if (presentation.responseTime) {
          stats.totalResponseTime += presentation.responseTime;
        }
      } else {
        stats.missCount++;
      }
    });

    const totalPresentations = taskResult.presentations.length;
    const efficiency = totalPresentations > 0 ? stats.successCount / totalPresentations : 0;
    const avgResponseTime = totalPresentations > 0 ? stats.totalResponseTime / totalPresentations : 0;
    
    const stimulusTime = taskResult.task.parameters?.stimulusTime || 0;
    const responseTime = taskResult.task.parameters?.responseTime || 0;
    const totalTime = stimulusTime + responseTime;
    
    const finalScore = totalTime > 0 ? efficiency * (1 - avgResponseTime / totalTime) : 0;
    const rows = taskResult.task.parameters?.rows || 1;
    const columns = taskResult.task.parameters?.columns || 1;
    const workload = totalTime > 0 ? (rows * columns) / totalTime : 0;
    
    let entropy = 0;
    if (efficiency > 0 && efficiency < 1) {
      entropy = -(efficiency * Math.log2(efficiency) + (1 - efficiency) * Math.log2(1 - efficiency));
    }

    // Расчет длительности (сумма всех временных параметров презентаций)
    const totalDuration = taskResult.presentations.reduce((sum, p) => {
      return sum + (p.responseTime || 0);
    }, 0);

    return {
      ...stats,
      finalScore,
      entropy,
      performance: efficiency * 100, // в процентах
      workload,
      avgResponseTime,
      efficiency,
      totalDuration,
    };
  });
};