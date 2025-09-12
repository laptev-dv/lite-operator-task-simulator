import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
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
            <TableCell align="center">
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                <Typography variant="body2">Ответы</Typography>
                <Tooltip 
                  title="Верные ответы / Ошибки / Пропуски" 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ p: 0 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </TableCell>
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
                {task.successCount} \ {task.errorCount} \ {task.missCount}  
              </TableCell>
              <TableCell align="center">{(task.efficiency * 100).toFixed(1)}%</TableCell>
              <TableCell align="center">{task.avgResponseTime / 1000} c</TableCell>
              <TableCell align="center">{task.workload.toFixed(4)}</TableCell>
              <TableCell align="center">{(task.finalScore * 100).toFixed(1)}%</TableCell>
              <TableCell align="center">{task.perfomance.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionResultsTable;