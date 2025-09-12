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
  Button,
} from "@mui/material";
import {
  Window as WindowsIcon,
  Description as ManualIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const InfoPage = () => {
  const theme = useTheme();

  const handleDownloadDesktop = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    // Создаем ссылку для скачивания файла из папки public
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/old-version-app.zip`;
    link.download = "old-version-app.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleItemClick = (handler) => {
    return (e) => {
      // Если клик был не по кнопке, вызываем обработчик
      if (!e.target.closest("button")) {
        handler(e);
      }
    };
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
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            onClick={handleItemClick(handleDownloadDesktop)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WindowsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Версия для Windows"
              secondary="Оригинальное десктопное приложение"
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadDesktop}
              sx={{ ml: 2 }}
            >
              Скачать
            </Button>
          </ListItem>

          <Divider variant="inset" component="li" />

          <Link
            to="https://github.com/laptev-dv/lite-operator-task-simulator#readme"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              sx={{
                px: 3,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ManualIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Руководство пользователя"
                secondary="Описание проекта"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<OpenInNewIcon />}
                sx={{ ml: 2 }}
              >
                Открыть
              </Button>
            </ListItem>
          </Link>
        </List>
      </Paper>
    </Container>
  );
};

export default InfoPage;
