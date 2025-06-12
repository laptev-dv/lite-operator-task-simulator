import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function EditFolderDialog({ open, onClose, folder, onSave }) {
  const [name, setName] = useState(folder.name);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ ...folder, name });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редактировать папку</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Измените название папки. Все эксперименты внутри сохранят свои ссылки,
          но будут отображаться под новым именем.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Название папки"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Отменить
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim() || name === folder.name}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFolderDialog;
