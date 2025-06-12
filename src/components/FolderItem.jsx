import React from "react";
import { Stack, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function FolderItem({ folder }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ flexGrow: 1 }}
    >
      <FolderIcon color="primary" fontSize="small" />

      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {folder.experiments.length} объекта • {format(new Date(folder.createdAt), "dd.MM.yyyy HH:mm", {
            locale: ru,
          })}
        </Typography>

        {/* Основное название */}
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {folder.name}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default FolderItem;
