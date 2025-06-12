import React from "react";
import { Typography, Paper, List, Divider } from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import TaskItem from "./EditableTaskItem";

const EditableExperimentTasks = ({
  tasks,
  activeTaskId,
  onTaskClick,
  onDeleteTask,
  onCopyTask,
  onTaskNameChange,
  onTasksChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      // Добавляем вывод в консоль для отладки
      console.log("New tasks order after drag:", newTasks);
      onTasksChange(newTasks); // Важно: вызываем колбэк для обновления в родительском компоненте
    }
  };

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <List
            dense
            sx={{ paddingRight: 1, height: "100%", overflowY: "auto", marginBottom: 2 }}
          >
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <TaskItem
                  id={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onCopy={onCopyTask}
                  isActive={activeTaskId === task.id}
                  onClick={() => onTaskClick(task.id)}
                  isDeleteDisabled={tasks.length <= 1}
                  onTaskNameChange={onTaskNameChange}
                />
                {index < tasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Paper>
  );
};

export default EditableExperimentTasks;
