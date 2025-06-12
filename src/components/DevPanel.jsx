import React from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableRow } from '@mui/material';

const DevPanel = ({ 
  timeLeft, 
  currentPhase,
  currentTaskIndex, 
  totalTasks,
  presentationCount,
  presentationsPerTask,
  hiddenPosition,
  taskParameters,
  successCount,
  errorCount,
  missCount,
  userInput,
  taskStats,
  seriesTimeLeft,
  mode
}) => {
  const phaseNames = {
    stimulus: 'Stimulus (символ скрыт)',
    response: 'Response (символ виден)',
    pause: 'Pause (пауза)'
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        right: 20,
        top: 20,
        width: 720,
        p: 2,
        zIndex: 1002,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Dev Panel ({mode === 'adaptive' ? 'Adaptive' : 'Strict'} mode)
      </Typography>

      {mode === 'adaptive' && (
        <Typography variant="body1">
          <strong>Total time left:</strong> {Math.floor(seriesTimeLeft / 60)}:{Math.floor(seriesTimeLeft % 60).toString().padStart(2, '0')}
        </Typography>
      )}

      <Typography variant="body1">
        <strong>Current phase:</strong> {phaseNames[currentPhase] || currentPhase}
      </Typography>

      <Typography variant="body1">
        <strong>Time left:</strong> {timeLeft.toFixed(2)}s
      </Typography>

      <Typography variant="body1">
        <strong>Presentations:</strong> {presentationCount}/{presentationsPerTask}
      </Typography>

      <Typography variant="body1">
        <strong>Current task:</strong> {currentTaskIndex + 1}/{totalTasks}
      </Typography>

      <Typography variant="body1">
        <strong>Hidden position:</strong>{" "}
        {hiddenPosition
          ? `Row ${hiddenPosition.row + 1}, Col ${hiddenPosition.col + 1}`
          : "None"}
      </Typography>

      <Typography variant="body1">
        <strong>User input:</strong> {userInput.join(', ') || 'None'}
      </Typography>

      <Typography variant="body1" mt={2}>
        <strong>Current session:</strong>
      </Typography>
      <Typography variant="body2">
        Success: {successCount} | Error: {errorCount} | Miss: {missCount}
      </Typography>

      {taskStats.length > 0 && (
        <>
          <Typography variant="body1" mt={2}>
            <strong>Task statistics:</strong>
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Efficiency</strong></TableCell>
                <TableCell><strong>Success</strong></TableCell>
                <TableCell><strong>Error</strong></TableCell>
                <TableCell><strong>Miss</strong></TableCell>
                <TableCell><strong>Avg Time</strong></TableCell>
              </TableRow>
              {taskStats.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>{(task.efficiency * 100).toFixed(1)}%</TableCell>
                  <TableCell>{task.success}</TableCell>
                  <TableCell>{task.error}</TableCell>
                  <TableCell>{task.miss}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Paper>
  );
};

export default DevPanel;