import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import TaskModal from "../Task/TaskModal";
import { useBoard } from "../../context/BoardContext";
import confetti from 'canvas-confetti';

const COLUMNS = ["backlog", "inprogress", "review", "done"];

const KanbanBoard = ({ onSelectTask }) => {
  const { tasks, updateTask, addTask } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("backlog");

  useEffect(() => {
  const handler = (e) => {
    if (
      e.key.toLowerCase() === "n" &&
      !e.target.matches("input, textarea")
    ) {
      setDefaultStatus("backlog");
      setModalOpen(true);
    }
  };

  window.addEventListener("keydown", handler);

  return () => {
    window.removeEventListener("keydown", handler);
  };
}, []);

  const getTasksByStatus = (status) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === "done") {
    confetti({ particleCount: 100, spread: 70 });
    }

    const colTasks = getTasksByStatus(destination.droppableId);
    const reordered = Array.from(colTasks);

    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    await Promise.all(
      reordered.map((task, index) =>
        updateTask(task._id, {
          status: destination.droppableId,
          order: index,
        })
      )
    );
  };

  const handleAddTask = (columnId) => {
    setDefaultStatus(columnId);
    setModalOpen(true);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4 p-4 overflow-x-hidden md:overflow-x-auto overflow-y-auto h-full">
          {COLUMNS.map((col) => (
            <Column
              key={col}
              columnId={col}
              tasks={getTasksByStatus(col)}
              onSelectTask={onSelectTask}
              onAddTask={handleAddTask}
            />
          ))}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TaskModal
          mode="create"
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onSave={async (data) => {
            await addTask(data);
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default KanbanBoard;
