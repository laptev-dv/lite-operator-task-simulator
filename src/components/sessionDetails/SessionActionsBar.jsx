import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  ContentCopy as CopyIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

function SessionActionsBar({
  onExportPDF,
  onExportXLSX,
  onRepeatExperiment,
  onDuplicateExperiment,
  loading = false,
}) {
  return (
    <>
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
          <Stack sx={{ flexGrow: 1 }} direction={"row-reverse"} gap={2}>
            {/* Кнопка повтора эксперимента */}
            <Button
              variant="contained"
              size="large"
              onClick={onRepeatExperiment}
              startIcon={<PlayArrowIcon />}
              sx={{ px: 4 }}
              disabled={loading}
            >
              Повторить
            </Button>
            
            {/* Кнопка дублирования эксперимента */}
            <Tooltip title="Создать копию эксперимента с текущими настройками">
              <Button
                variant="outlined"
                size="large"
                onClick={onDuplicateExperiment}
                startIcon={<CopyIcon />}
                sx={{ px: 4 }}
                disabled={loading}
              >
                Дублировать
              </Button>
            </Tooltip>

            {/* Кнопки экспорта */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="large"
                onClick={onExportXLSX}
                startIcon={<FileDownloadIcon />}
                disabled={loading}
              >
                XLSX
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={onExportPDF}
                startIcon={<PictureAsPdfIcon />}
                disabled={loading}
              >
                PDF
              </Button>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default SessionActionsBar;