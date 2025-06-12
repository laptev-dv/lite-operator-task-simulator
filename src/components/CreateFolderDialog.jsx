import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

function CreateFolderDialog({ open, onClose, onCreate }) {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreate(folderName);
      setFolderName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Создать новую папку</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Введите название для новой папки. Папка поможет вам организовать
          ваши эксперименты.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Название папки"
          type="text"
          fullWidth
          variant="standard"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate} disabled={!folderName.trim()}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateFolderDialog;