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
    
    const stimulusTime = taskResult.task.stimulusTime;
    const responseTime = taskResult.task.responseTime;
    const totalTime = stimulusTime + responseTime;
    
    const finalScore = efficiency * (1 - avgResponseTime / totalTime);
    const rows = taskResult.task.rows;
    const columns = taskResult.task.columns;
    const workload = (rows * columns) / totalTime;
    
    let entropy = 0;
    if (efficiency > 0 && efficiency < 1) {
      entropy = -(efficiency * Math.log2(efficiency) + (1 - efficiency) * Math.log2(1 - efficiency));
    }

    const totalDuration = taskResult.presentations.reduce((sum, p) => {
      return sum + (p.responseTime || 0);
    }, 0);

    const disapperancesPerMinute = 1;
    const perfomance = disapperancesPerMinute * (1 - entropy) * finalScore;

    console.log(avgResponseTime);

    return {
      ...stats,
      finalScore,
      perfomance,
      workload,
      avgResponseTime,
      efficiency,
      totalDuration,
    };
  });
};