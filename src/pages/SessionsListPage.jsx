import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Button,
  Stack,
  useTheme,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import { FileDownload as ExportIcon } from "@mui/icons-material";
import SessionItem from "../components/SessionItem";
import ExportSessionsDialog from "../components/ExportSessionsDialog";
import { sessionApi } from "../api/sessionApi";
import SessionBreadCrumbs from "../components/sessionDetails/SessionBreadCrumbs";
import { exportSessionToXLSX } from "../utils/exportSession"; // Добавлен импорт

function SessionsListPage() {
  const theme = useTheme();
  const { id } = useParams();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const response = await sessionApi.getByExperiment(id);
        setSessions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSessions();
    }
  }, [id]);

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionApi.delete(sessionId);
      setSessions(sessions.filter((s) => s._id !== sessionId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <SessionBreadCrumbs experimentId={id} lastName="Все сессии"/>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Все сессии эксперимента
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 2 }}>
          {sessions.length > 0 ? (
            <List disablePadding>
              {sessions.map((session, index) => (
                <Box key={session._id}>
                  <RouterLink
                    to={`/session/${session._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <SessionItem
                      session={session}
                      onDelete={() => {
                        handleDeleteSession(session._id);
                      }}
                      showDivider={index !== sessions.length - 1}
                      onExport={() => exportSessionToXLSX(session)}
                    />
                  </RouterLink>
                </Box>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Нет доступных сессий
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar>
          <Stack
            direction="row"
            spacing={2}
            sx={{ flexGrow: 1 }}
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExportClick}
              disabled={sessions.length === 0}
            >
              Экспорт сессий
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <ExportSessionsDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        sessions={sessions}
      />
    </Container>
  );
}

export default SessionsListPage;