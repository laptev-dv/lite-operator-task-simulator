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
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

function SessionActionsBar({
  sessionData,
  onExportPDF,
  onExportXLSX,
  onRepeatExperiment,
  onDuplicateExperiment,
  loading = false,
}) {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const exportMenuOpen = Boolean(exportAnchorEl);

  const handleExportMenuOpen = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportXLSXClick = () => {
    onExportXLSX();
    handleExportMenuClose();
  };

  const handleExportPDFClick = () => {
    onExportPDF();
    handleExportMenuClose();
  };

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
                onClick={onDuplicateExperiment}
                startIcon={<CopyIcon />}
                sx={{ px: 4 }}
                disabled={loading}
              >
                Дублировать
              </Button>
            </Tooltip>

            {/* Кнопка экспорта с выпадающим меню */}
            <Button
              variant="outlined"
              onClick={handleExportMenuOpen}
              startIcon={<FileDownloadIcon />}
              disabled={loading}
            >
              Экспорт
            </Button>
            
            <Menu
              anchorEl={exportAnchorEl}
              open={exportMenuOpen}
              onClose={handleExportMenuClose}
            >
              <MenuItem onClick={handleExportXLSXClick}>
                <FileDownloadIcon sx={{ mr: 1 }} />
                XLSX
              </MenuItem>
              <MenuItem onClick={handleExportPDFClick}>
                <PictureAsPdfIcon sx={{ mr: 1 }} />
                PDF
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default SessionActionsBar;