import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Typography,
  Stack
} from '@mui/material';
import { 
  CheckCircle,
  Cancel,
  AccessTimeFilled as Timer,
} from '@mui/icons-material';
import { formatDuration } from '../../utils/dateFormatter'

const SessionResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        Нет данных о результатах
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell align="center">Ответы</TableCell>
            <TableCell align="center">Эффективность</TableCell>
            <TableCell align="center">Среднее время</TableCell>
            <TableCell align="center">Нагрузка</TableCell>
            <TableCell align="center">Итоговая оценка</TableCell>
            <TableCell align="center">Производительность</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((task, index) => (
            <TableRow key={task.taskId || index}>
              <TableCell>{task.taskName || `${index + 1}`}</TableCell>
              <TableCell align="center">
                <Stack justifyContent='center' gap={1} direction='row'>
                  <Chip 
                    icon={<CheckCircle />} 
                    label={task.successCount} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Cancel />} 
                    label={task.errorCount} 
                    color="error" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Timer />} 
                    label={task.missCount} 
                    color="warning" 
                    size="small" 
                  />
                </Stack>
              </TableCell>
              <TableCell align="center">{(task.efficiency * 100).toFixed(1)}%</TableCell>
              <TableCell align="center">{formatDuration(task.avgResponseTime)}</TableCell>
              <TableCell align="center">{task.workload.toFixed(4)}</TableCell>
              <TableCell align="center">{(task.finalScore * 100).toFixed(1)}%</TableCell>
              <TableCell align="center">{0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionResultsTable;