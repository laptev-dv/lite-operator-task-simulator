import React from "react";
import { Typography, Paper, List, Divider } from "@mui/material";
import TaskItem from "./TaskItem";

const ExperimentTasks = ({ tasks, activeTaskId, onTaskClick }) => {
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
        Задачи ({tasks.length} шт)
      </Typography>

      <List
        dense
        sx={{
          paddingRight: 1,
          height: "100%",
          overflowY: "auto",
          marginBottom: 2,
        }}
      >
        {tasks.map((task, index) => (
          <React.Fragment key={task._id}>
            <TaskItem
              task={task}
              isActive={activeTaskId === task._id}
              onClick={() => onTaskClick(task._id)}
            />
            {index < tasks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ExperimentTasks;
