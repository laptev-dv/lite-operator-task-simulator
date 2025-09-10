import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Window as WindowsIcon,
  Description as ManualIcon,
} from "@mui/icons-material";

const InfoPage = () => {
  const theme = useTheme();

  const handleDownloadDesktop = () => {
    // Создаем ссылку для скачивания файла из папки public
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/old-version-app.zip`;
    link.download = 'old-version-app.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReadme = () => {
    // Открываем README проекта в новой вкладке
    window.open('https://github.com/laptev-dv/lite-operator-task-simulator#readme', '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Блок дополнительных материалов */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle1">Дополнительные материалы</Typography>
        </Box>
        <List>
          <ListItem 
            sx={{ 
              px: 3, 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
            onClick={handleDownloadDesktop}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WindowsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Версия для Windows"
              secondary="Оригинальное десктопное приложение"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem 
            sx={{ 
              px: 3, 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
            onClick={handleOpenReadme}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ManualIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Руководство пользователя"
              secondary="Описание проекта"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default InfoPage;