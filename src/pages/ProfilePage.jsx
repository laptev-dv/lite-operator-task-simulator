import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Window as WindowsIcon,
  Description as ManualIcon,
  Science as ExperimentIcon,
} from "@mui/icons-material";

const ProfilePage = () => {
  const theme = useTheme();

  const handleDownload = (item) => {
    console.log(`Загрузка: ${item}`);
    // Реализация загрузки файлов
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Блок дополнительных материалов */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Дополнительные материалы</Typography>
        </Box>
        <List>
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WindowsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Версия для Windows"
              secondary="Десктопное приложение"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("windows_app");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ManualIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Руководство пользователя"
              secondary="Полное описание функций"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("user_manual");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem sx={{ px: 3 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExperimentIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Проведение эксперимента"
              secondary="Инструкция по работе"
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload("experiment_guide");
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <DownloadIcon />
            </IconButton>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default ProfilePage;