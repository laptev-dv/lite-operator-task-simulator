import React from "react";
import { Typography, Paper, List, Divider } from "@mui/material";
import SessionResultItem from "./SessionResultItem";

const SessionResults = ({ results, activeResultId, onTaskClick }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        paddingLeft: 2,
        paddingRight: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" gutterBottom marginTop={2}>
        Результаты ({results.length} шт)
      </Typography>

      <List dense sx={{ paddingRight: 1, height: "100%", overflowY: "auto", marginBottom: 2 }}>
        {results.map((result, index) => (
          <React.Fragment key={result._id}>
            <SessionResultItem
              task={result.task}
              isActive={activeResultId === result._id}
              onClick={() => onTaskClick(result._id)}
              stats={{
                success: result.successCount,
                error: result.errorCount,
                miss: result.missCount,
                efficiency: result.efficiency,
              }}
            />
            {index < results.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default SessionResults;
